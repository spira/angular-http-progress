import {INgHttpProgressServiceConfig} from "../provider/ngHttpProgressServiceProvider";
export class NgHttpProgressService {

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
    constructor(private config:INgHttpProgressServiceConfig,
                private $q:ng.IQService,
                private $timeout:ng.ITimeoutService,
                private ngProgress:NgProgress.NgProgress) {

        this.ngProgress.color(this.config.color);
        this.ngProgress.height(this.config.height);

    }

    /**
     * Start the progress bar running
     * @returns {any}
     */
    public start():ng.IPromise<number> {

        this.pendingDelays++;

        if (this.currentProgressDeferred) { //exists

            if (this.stopped) {
                this.stopped = false;
                this.currentProgressDeferred.notify('start');
            } else {
                this.currentProgressDeferred.notify('bumpback');
            }

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
            fallBackTo = currentProgress - currentProgress * (currentProgress / 120);

        this.set(fallBackTo);
        return this.progressPromise;
    }

    /**
     * Halt the progress bar
     * @returns {IPromise<number>}
     */
    public stop():ng.IPromise<number> {
        this.currentProgressDeferred.notify('stop');
        return this.progressPromise;
    }

    /**
     * Complete the progress
     * @returns {IPromise<number>}
     */
    public complete():ng.IPromise<number> {

        this.pendingDelays--;
        if (this.pendingDelays === 0) { //no more delays remaining
            this.currentProgressDeferred.resolve();
        }

        return this.progressPromise;
    }

    /**
     * Reset the progress bar to zero
     * @returns {IPromise<number>}
     */
    public rewind():ng.IPromise<number> {
        if (this.currentProgressDeferred) {
            this.currentProgressDeferred.reject();
        }
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
     * Handle the stopping.
     * @returns {IPromise<number>}
     */
    private halt():ng.IPromise<number> {

        this.stopped = true;

        return this.$timeout(() => { //wrap in $timeout to allow $digest to have a cycle
            let currentStatus = this.status();
            this.ngProgress.stop();
            return currentStatus;
        });

    }

    /**
     * Intialise the progress deferred promise
     * @returns {IPromise<number>}
     */
    private initProgressMeter():ng.IPromise<number> {

        this.currentProgressDeferred = this.$q.defer();

        this.ngProgress.start();

        return this.progressPromise = this.currentProgressDeferred.promise
            .then(() => { //success
                return this.finish();
            }, () => { //error
                return this.reset();
            }, (action:string) => { //notify

                switch (action) {
                    case 'start':
                        this.ngProgress.start();
                        break;
                    case 'stop':
                        this.halt();
                        break;
                    case 'bumpback':
                        this.bumpBack();
                        break;
                }

            })
            .finally(() => {
                this.currentProgressDeferred = null; //clear the current progress
                this.progressPromise = null; //clear the current progress
                this.pendingDelays = 0; //reset
            });

    }
}
