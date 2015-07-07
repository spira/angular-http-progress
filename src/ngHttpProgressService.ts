/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="./ngHttpProgressInterfaces.ts" />

module NgHttpProgress {

    export class NgHttpProgressService implements INgHttpProgressService {

        private currentProgressDeferred:ng.IDeferred<number>;
        private progressPromise:ng.IPromise<number>;

        static ngProgressFinishTime = 1600; //time for finish to complete

        private pendingDelays = 0;

        private stopped:boolean = false;
        /**
         * Construct the service with dependencies injected
         * @param config
         * @param $q
         * @param $timeout
         * @param ngProgress
         */
        constructor(
            private config:INgHttpProgressServiceConfig,
            private $q: ng.IQService,
            private $timeout: ng.ITimeoutService,
            private ngProgress: ngProgress
        ) {

            this.ngProgress.color(this.config.color);
            this.ngProgress.height(this.config.height);

        }

        /**
         * Start the progress bar running
         * @returns {any}
         */
        public start():ng.IPromise<number> {

            this.pendingDelays ++;

            if (this.currentProgressDeferred){ //exists
                this.currentProgressDeferred.notify(true);

                return this.progressPromise;
            }


            return this.initProgressMeter();
        }


        /**
         * Bump back the current status to less completed
         * @returns {number}
         */
        private bumpBack():ng.IPromise<number> {

            let currentProgress = this.status(),
                fallBackTo = currentProgress - currentProgress * (currentProgress/120);

            this.set(fallBackTo);
            return this.progressPromise;
        }

        /**
         * Halt the progress bar
         * @returns {IPromise<T>}
         */
        public stop():ng.IPromise<number> {
            this.currentProgressDeferred.notify(false);
            return this.progressPromise;
        }

        /**
         * Complete the progress
         * @returns {IPromise<T>}
         */
        public complete():ng.IPromise<number> {

            this.pendingDelays --;
            if (this.pendingDelays === 0){ //no more delays remaining
                this.currentProgressDeferred.resolve();
            }

            return this.progressPromise;
        }

        /**
         * Reset the progress bar to zero
         * @returns {IPromise<T>}
         */
        public rewind():ng.IPromise<number> {
            this.currentProgressDeferred.reject();
            return this.progressPromise;
        }

        /**
         * Get the status of the progress bar
         * @returns {number}
         */
        public status():number {
            return this.ngProgress.status();
        }

        public progressStatus():ng.IPromise<number> {
            return this.progressPromise;
        }

        /**
         * Set the status of the progress bar
         * @param percentage
         */
        public set(percentage:number):ng.IPromise<number> {

            this.$timeout(() => { //immediately invoke timeout in case a $digest cycle is busy
                this.ngProgress.set(percentage);
            });

            return this.progressPromise;
        }

        /**
         * Finish the progress of the promise
         * @returns {IPromise<any>}
         */
        private finish():ng.IPromise<number> {
            let finishStatus = this.status();

            this.$timeout(() => { //wrap in $timeout to allow $digest to have a cycle
                this.ngProgress.complete();
            });

            return this.$timeout(() => { //wait for the animation to finish before setting status
                return finishStatus;
            }, NgHttpProgressService.ngProgressFinishTime);
        }

        /**
         * Handle the reset. Immediately invoke as the ngProgress service executes immediately
         * @returns {IPromise<number>}
         */
        private reset():ng.IPromise<number> {

            return this.$timeout(() => { //wrap in $timeout to allow $digest to have a cycle
                let finishStatus = this.status();
                this.ngProgress.reset();
                return finishStatus;
            });

        }

        /**
         * Intialise the progress deferred promise
         * @returns {IPromise<TResult>}
         */
        private initProgressMeter():ng.IPromise<number> {

            this.currentProgressDeferred = this.$q.defer();

            this.ngProgress.start();

            return this.progressPromise = this.currentProgressDeferred.promise
                .then(() => { //success
                    return this.finish();
                }, () => { //error
                    return this.reset();
                }, (bumpBack:boolean) => { //notify

                    if (bumpBack) {
                        this.bumpBack();
                    } else if (this.stopped){

                        this.ngProgress.start();
                    }else{

                        this.stop();
                    }
                })
                .finally(() => {
                    this.currentProgressDeferred = null; //clear the current progress
                    this.progressPromise = null; //clear the current progress
                    this.pendingDelays = 0; //reset
                });

        }
    }

}
