/// <reference path="../typings/tsd.d.ts" />
declare module NgHttpProgress {
    class NgHttpProgressInterceptor {
        private $q;
        private $injector;
        private ngHttpProgressService;
        /**
         * Construct the service with dependencies injected
         * @param _$q
         * @param _$injector
         */
        static $inject: string[];
        constructor($q: ng.IQService, $injector: ng.auto.IInjectorService);
        private getNgHttpProgressService;
        request: (config: any) => any;
        response: (response: any) => any;
        responseError: (response: any) => any;
    }
}
declare module NgHttpProgress {
    interface ngProgress {
        start(): void;
        height(cssHeight: string): void;
        color(cssColor: string): void;
        status(): number;
        stop(): void;
        set(percentage: number): void;
        reset(): void;
        complete(): void;
        getDomElement(): Element;
    }
    interface INgHttpProgressService {
        start(): ng.IPromise<number>;
        stop(): ng.IPromise<number>;
        complete(): ng.IPromise<number>;
        rewind(): ng.IPromise<number>;
        status(): number;
        set(percentage: number): void;
    }
    interface IngHttpProgressServiceProvider {
        configure(config: INgHttpProgressServiceConfig): NgHttpProgressServiceProvider;
    }
    interface INgHttpProgressServiceConfig {
        color?: string;
        height?: string;
    }
}
declare module NgHttpProgress {
    class NgHttpProgressService implements INgHttpProgressService {
        private config;
        private $q;
        private $timeout;
        private ngProgress;
        private currentProgressDeferred;
        private progressPromise;
        static ngProgressFinishTime: number;
        private pendingDelays;
        private stopped;
        /**
         * Construct the service with dependencies injected
         * @param config
         * @param $q
         * @param $timeout
         * @param ngProgress
         */
        constructor(config: INgHttpProgressServiceConfig, $q: ng.IQService, $timeout: ng.ITimeoutService, ngProgress: ngProgress);
        /**
         * Start the progress bar running
         * @returns {any}
         */
        start(): ng.IPromise<number>;
        /**
         * Bump back the current status to less completed
         * @returns {number}
         */
        private bumpBack();
        /**
         * Halt the progress bar
         * @returns {IPromise<T>}
         */
        stop(): ng.IPromise<number>;
        /**
         * Complete the progress
         * @returns {IPromise<T>}
         */
        complete(): ng.IPromise<number>;
        /**
         * Reset the progress bar to zero
         * @returns {IPromise<T>}
         */
        rewind(): ng.IPromise<number>;
        /**
         * Get the status of the progress bar
         * @returns {number}
         */
        status(): number;
        progressStatus(): ng.IPromise<number>;
        /**
         * Set the status of the progress bar
         * @param percentage
         */
        set(percentage: number): ng.IPromise<number>;
        /**
         * Finish the progress of the promise
         * @returns {IPromise<any>}
         */
        private finish();
        /**
         * Handle the reset. Immediately invoke as the ngProgress service executes immediately
         * @returns {IPromise<number>}
         */
        private reset();
        /**
         * Handle the stopping.
         * @returns {IPromise<any>}
         */
        private halt();
        /**
         * Intialise the progress deferred promise
         * @returns {IPromise<TResult>}
         */
        private initProgressMeter();
    }
}
declare module NgHttpProgress {
    class Error {
        name: string;
        message: string;
        stack: string;
        constructor(message?: string);
    }
    class NgHttpProgressException extends Error {
        message: string;
        constructor(message: string);
        toString(): string;
    }
    class NgHttpProgressServiceProvider implements ng.IServiceProvider, IngHttpProgressServiceProvider {
        private config;
        /**
         * Initialise the service provider
         */
        constructor();
        /**
         * Set the configuration
         * @param config
         * @returns {NgHttpProgress.NgHttpProgressServiceProvider}
         */
        configure(config: INgHttpProgressServiceConfig): NgHttpProgressServiceProvider;
        $get: (string | (($q: any, $timeout: any, ngProgress: any) => NgHttpProgressService))[];
    }
}
