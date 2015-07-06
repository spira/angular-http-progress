/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="./ngHttpProgressInterfaces.ts" />

module NgHttpProgress {

    export class NgHttpProgressService implements INgHttpProgressService {

        private currentProgressDeferred:ng.IDeferred<number>;

        static ngProgressFinishTime = 1600; //time for finish to complete

        /**
         * Construct the service with dependencies injected
         * @param config
         * @param $http
         * @param $q
         * @param $window
         * @param $timeout
         * @param ngProgress
         */
        constructor(
            private config:INgHttpProgressServiceConfig,
            private $http: ng.IHttpService,
            private $q: ng.IQService,
            private $window: ng.IWindowService,
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

            if (this.currentProgressDeferred){ //exists
                this.currentProgressDeferred.notify(true);

                return this.currentProgressDeferred.promise;
            }

            this.currentProgressDeferred = this.$q.defer();

            return this.initDeferred();
        }


        /**
         * Bump back the current status to less completed
         * @returns {number}
         */
        private bumpBack():boolean|number {

            let currentProgress = this.status(),
                fallBackTo = currentProgress - currentProgress * (currentProgress/120);

            this.set(fallBackTo);
            return this.status();
        }

        /**
         * Halt the progress bar
         * @returns {IPromise<T>}
         */
        public stop():ng.IPromise<number> {
            let completionPromise = this.currentProgressDeferred.promise;
            this.currentProgressDeferred.notify(false);
            return completionPromise;
        }

        /**
         * Complete the progress
         * @returns {IPromise<T>}
         */
        public complete():ng.IPromise<number> {

            let completionPromise = this.currentProgressDeferred.promise;
            this.currentProgressDeferred.resolve();
            return completionPromise;
        }

        /**
         * Reset the progress bar to zero
         * @returns {IPromise<T>}
         */
        public reset():ng.IPromise<number> {
            let completionPromise = this.currentProgressDeferred.promise;
            this.currentProgressDeferred.reject();
            return completionPromise;
        }

        /**
         * Get the status of the progress bar
         * @returns {number}
         */
        public status():number {
            return this.ngProgress.status();
        }

        /**
         * Set the status of the progress bar
         * @param percentage
         */
        public set(percentage:number):void {
            return this.ngProgress.set(percentage);
        }

        /**
         * Finish the progress of the promise
         * @returns {IPromise<any>}
         */
        private finish():ng.IPromise<number> {
            let finishStatus = this.status();
            this.ngProgress.complete();
            return this.$timeout(function () { //wait for the animation to finish before setting status
                return finishStatus;
            }, NgHttpProgressService.ngProgressFinishTime);
        }

        /**
         * Intialise the progress deferred promise
         * @returns {IPromise<TResult>}
         */
        private initDeferred():ng.IPromise<number> {

            if (!this.currentProgressDeferred){
                throw new NgHttpProgress.NgHttpProgressException("No deferred site progress registered");
            }

            return this.currentProgressDeferred.promise
                .then(() => { //success
                    return this.finish();
                }, () => { //error
                    this.ngProgress.reset();
                }, (bumpBack:boolean) => { //notify
                    if (bumpBack) {
                        this.bumpBack();
                    } else {
                        this.stop();
                    }
                })
                .finally(() => {
                    this.currentProgressDeferred = null; //clear the current progress
                });

        }
    }

}
