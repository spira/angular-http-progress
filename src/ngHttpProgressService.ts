/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="./ngHttpProgressInterfaces.ts" />

module NgHttpProgress {

    export class NgHttpProgressService implements INgHttpProgressService {

        //list injected dependencies
        private config: INgHttpProgressServiceConfig;
        private $http: ng.IHttpService;
        private $q: ng.IQService;
        private $window: ng.IWindowService;
        private $interval:ng.IIntervalService;

        /**
         * Construct the service with dependencies injected
         * @param _config
         * @param _$http
         * @param _$q
         * @param _$window
         * @param _$interval
         */
        constructor(_config:INgHttpProgressServiceConfig, _$http: ng.IHttpService, _$q: ng.IQService, _$window: ng.IWindowService, _$interval: ng.IIntervalService) {

            this.config = _config;
            this.$http = _$http;
            this.$q = _$q;
            this.$window = _$window;
            this.$interval = _$interval;

        }

        start():boolean {
            return undefined;
        }

        stop():boolean {
            return undefined;
        }

        complete():boolean {
            return undefined;
        }

        reset():boolean {
            return undefined;
        }

        status():number {
            return undefined;
        }

        set():boolean {
            return undefined;
        }

    }

}
