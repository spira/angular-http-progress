/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
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
    }
    interface INgHttpProgressService {
        start(): ng.IPromise<number>;
        stop(): ng.IPromise<number>;
        complete(): ng.IPromise<number>;
        reset(): ng.IPromise<number>;
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
        constructor(_$q: ng.IQService, _$injector: ng.auto.IInjectorService);
        private getNgHttpProgressService;
        request: (config: any) => any;
        response: (response: any) => any;
        responseError: (response: any) => any;
    }
}
declare module NgHttpProgress {
    class NgHttpProgressService implements INgHttpProgressService {
        private config;
        private $http;
        private $q;
        private $window;
        private $timeout;
        private ngProgress;
        private currentProgressDeferred;
        static ngProgressFinishTime: number;
        /**
         * Construct the service with dependencies injected
         * @param config
         * @param $http
         * @param $q
         * @param $window
         * @param $timeout
         * @param ngProgress
         */
        constructor(config: INgHttpProgressServiceConfig, $http: ng.IHttpService, $q: ng.IQService, $window: ng.IWindowService, $timeout: ng.ITimeoutService, ngProgress: ngProgress);
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
        reset(): ng.IPromise<number>;
        /**
         * Get the status of the progress bar
         * @returns {number}
         */
        status(): number;
        /**
         * Set the status of the progress bar
         * @param percentage
         */
        set(percentage: number): void;
        /**
         * Finish the progress of the promise
         * @returns {IPromise<any>}
         */
        private finish();
        /**
         * Intialise the progress deferred promise
         * @returns {IPromise<TResult>}
         */
        private initDeferred();
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
        $get: (string | (($http: any, $q: any, $window: any, $interval: any, ngProgress: any) => NgHttpProgressService))[];
    }
}
