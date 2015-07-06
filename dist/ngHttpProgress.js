/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
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
         * @param config
         * @param $http
         * @param $q
         * @param $window
         * @param $timeout
         * @param ngProgress
         */
        function NgHttpProgressService(config, $http, $q, $window, $timeout, ngProgress) {
            this.config = config;
            this.$http = $http;
            this.$q = $q;
            this.$window = $window;
            this.$timeout = $timeout;
            this.ngProgress = ngProgress;
            this.ngProgress.color(this.config.color);
            this.ngProgress.height(this.config.height);
        }
        /**
         * Start the progress bar running
         * @returns {any}
         */
        NgHttpProgressService.prototype.start = function () {
            if (this.currentProgressDeferred) {
                this.currentProgressDeferred.notify(true);
                return this.currentProgressDeferred.promise;
            }
            this.currentProgressDeferred = this.$q.defer();
            return this.initDeferred();
        };
        /**
         * Bump back the current status to less completed
         * @returns {number}
         */
        NgHttpProgressService.prototype.bumpBack = function () {
            var currentProgress = this.status(), fallBackTo = currentProgress - currentProgress * (currentProgress / 120);
            this.set(fallBackTo);
            return this.status();
        };
        /**
         * Halt the progress bar
         * @returns {IPromise<T>}
         */
        NgHttpProgressService.prototype.stop = function () {
            var completionPromise = this.currentProgressDeferred.promise;
            this.currentProgressDeferred.notify(false);
            return completionPromise;
        };
        /**
         * Complete the progress
         * @returns {IPromise<T>}
         */
        NgHttpProgressService.prototype.complete = function () {
            var completionPromise = this.currentProgressDeferred.promise;
            this.currentProgressDeferred.resolve();
            return completionPromise;
        };
        /**
         * Reset the progress bar to zero
         * @returns {IPromise<T>}
         */
        NgHttpProgressService.prototype.reset = function () {
            var completionPromise = this.currentProgressDeferred.promise;
            this.currentProgressDeferred.reject();
            return completionPromise;
        };
        /**
         * Get the status of the progress bar
         * @returns {number}
         */
        NgHttpProgressService.prototype.status = function () {
            return this.ngProgress.status();
        };
        /**
         * Set the status of the progress bar
         * @param percentage
         */
        NgHttpProgressService.prototype.set = function (percentage) {
            return this.ngProgress.set(percentage);
        };
        /**
         * Finish the progress of the promise
         * @returns {IPromise<any>}
         */
        NgHttpProgressService.prototype.finish = function () {
            var finishStatus = this.status();
            this.ngProgress.complete();
            return this.$timeout(function () {
                return finishStatus;
            }, NgHttpProgressService.ngProgressFinishTime);
        };
        /**
         * Intialise the progress deferred promise
         * @returns {IPromise<TResult>}
         */
        NgHttpProgressService.prototype.initDeferred = function () {
            var _this = this;
            if (!this.currentProgressDeferred) {
                throw new NgHttpProgress.NgHttpProgressException("No deferred site progress registered");
            }
            return this.currentProgressDeferred.promise
                .then(function () {
                return _this.finish();
            }, function () {
                _this.ngProgress.reset();
            }, function (bumpBack) {
                if (bumpBack) {
                    _this.bumpBack();
                }
                else {
                    _this.stop();
                }
            })
                .finally(function () {
                _this.currentProgressDeferred = null; //clear the current progress
            });
        };
        NgHttpProgressService.ngProgressFinishTime = 1600; //time for finish to complete
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
            this.$get = ['$http', '$q', '$window', '$interval', 'ngProgress', function ngHttpProgressServiceFactory($http, $q, $window, $interval, ngProgress) {
                    return new NgHttpProgress.NgHttpProgressService(this.config, $http, $q, $window, $interval, ngProgress);
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
    angular.module('ngHttpProgress', ['ngProgress'])
        .provider('ngHttpProgress', NgHttpProgressServiceProvider)
        .service('ngHttpProgressInterceptor', NgHttpProgress.NgHttpProgressInterceptor)
        .config(['$httpProvider', '$injector', function ($httpProvider) {
            $httpProvider.interceptors.push('ngHttpProgressInterceptor');
        }]);
})(NgHttpProgress || (NgHttpProgress = {}));
//# sourceMappingURL=ngHttpProgress.js.map