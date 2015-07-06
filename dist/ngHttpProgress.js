/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="./ngHttpProgressInterfaces.ts" />
var NgHttpProgress;
(function (NgHttpProgress) {
    var NgHttpProgressInterceptor = (function () {
        function NgHttpProgressInterceptor(_$q, _$injector) {
            var _this = this;
            this.getNgHttpProgressService = function () {
                if (_this.ngHttpProgressService == null) {
                    _this.ngHttpProgressService = _this.$injector.get('ngHttpProgressService');
                }
                return _this.ngHttpProgressService;
            };
            this.request = function (config) {
                var ngHttpProgressService = _this.getNgHttpProgressService();
                //@todo start progress bar
                return config;
            };
            this.response = function (response) {
                var ngHttpProgressService = _this.getNgHttpProgressService();
                //@todo advance progress bar to end
                return response;
            };
            this.responseError = function (response) {
                var ngHttpProgressService = _this.getNgHttpProgressService();
                //@todo rewind progress bar
                return response;
            };
            this.$q = _$q;
            this.$injector = _$injector;
        }
        /**
         * Construct the service with dependencies injected
         * @param _$q
         * @param _$injector
         */
        NgHttpProgressInterceptor.$inject = ['$q', '$injector'];
        return NgHttpProgressInterceptor;
    })();
    NgHttpProgress.NgHttpProgressInterceptor = NgHttpProgressInterceptor;
})(NgHttpProgress || (NgHttpProgress = {}));
/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="./ngHttpProgressInterfaces.ts" />
var NgHttpProgress;
(function (NgHttpProgress) {
    var NgHttpProgressService = (function () {
        /**
         * Construct the service with dependencies injected
         * @param _config
         * @param _$http
         * @param _$q
         * @param _$window
         * @param _$interval
         */
        function NgHttpProgressService(_config, _$http, _$q, _$window, _$interval) {
            this.config = _config;
            this.$http = _$http;
            this.$q = _$q;
            this.$window = _$window;
            this.$interval = _$interval;
        }
        NgHttpProgressService.prototype.start = function () {
            return undefined;
        };
        NgHttpProgressService.prototype.stop = function () {
            return undefined;
        };
        NgHttpProgressService.prototype.complete = function () {
            return undefined;
        };
        NgHttpProgressService.prototype.reset = function () {
            return undefined;
        };
        NgHttpProgressService.prototype.status = function () {
            return undefined;
        };
        NgHttpProgressService.prototype.set = function () {
            return undefined;
        };
        return NgHttpProgressService;
    })();
    NgHttpProgress.NgHttpProgressService = NgHttpProgressService;
})(NgHttpProgress || (NgHttpProgress = {}));
/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="./ngHttpProgressInterfaces.ts" />
/// <reference path="./ngHttpProgressService.ts" />
/// <reference path="./ngHttpProgressInterceptor.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var NgHttpProgress;
(function (NgHttpProgress) {
    var NgHttpProgressException = (function (_super) {
        __extends(NgHttpProgressException, _super);
        function NgHttpProgressException(message) {
            _super.call(this, message);
            this.message = message;
            this.name = 'NgHttpProgressException';
            this.message = message;
            this.stack = (new Error()).stack;
        }
        NgHttpProgressException.prototype.toString = function () {
            return this.name + ': ' + this.message;
        };
        return NgHttpProgressException;
    })(Error);
    NgHttpProgress.NgHttpProgressException = NgHttpProgressException;
    var NgHttpProgressServiceProvider = (function () {
        /**
         * Initialise the service provider
         */
        function NgHttpProgressServiceProvider() {
            this.$get = ['$http', '$q', '$window', '$interval', function ngHttpProgressServiceFactory($http, $q, $window, $interval) {
                    return new NgHttpProgress.NgHttpProgressService(this.config, $http, $q, $window, $interval);
                }];
            //initialise service config
            this.config = {
                color: '#FF0000',
                height: '10px'
            };
        }
        /**
         * Set the configuration
         * @param config
         * @returns {NgHttpProgress.NgHttpProgressServiceProvider}
         */
        NgHttpProgressServiceProvider.prototype.configure = function (config) {
            this.config = _.defaults(config, this.config);
            return this;
        };
        return NgHttpProgressServiceProvider;
    })();
    NgHttpProgress.NgHttpProgressServiceProvider = NgHttpProgressServiceProvider;
    angular.module('ngHttpProgress', [])
        .provider('ngHttpProgress', NgHttpProgressServiceProvider)
        .service('ngHttpProgressInterceptor', NgHttpProgress.NgHttpProgressInterceptor)
        .config(['$httpProvider', '$injector', function ($httpProvider) {
            $httpProvider.interceptors.push('ngHttpProgressInterceptor');
        }]);
})(NgHttpProgress || (NgHttpProgress = {}));
//# sourceMappingURL=ngHttpProgress.js.map