/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
declare module NgHttpProgress {
    interface INgHttpProgressService {
        start(): boolean;
        stop(): boolean;
        complete(): boolean;
        reset(): boolean;
        status(): number;
        set(): boolean;
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
        private $interval;
        /**
         * Construct the service with dependencies injected
         * @param _config
         * @param _$http
         * @param _$q
         * @param _$window
         * @param _$interval
         */
        constructor(_config: INgHttpProgressServiceConfig, _$http: ng.IHttpService, _$q: ng.IQService, _$window: ng.IWindowService, _$interval: ng.IIntervalService);
        start(): boolean;
        stop(): boolean;
        complete(): boolean;
        reset(): boolean;
        status(): number;
        set(): boolean;
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
        $get: (string | (($http: any, $q: any, $window: any, $interval: any) => NgHttpProgressService))[];
    }
}
