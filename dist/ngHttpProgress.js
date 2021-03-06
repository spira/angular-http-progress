/// <reference path="../typings/tsd.d.ts" />
var NgHttpProgress;
(function (NgHttpProgress) {
    var NgHttpProgressInterceptor = (function () {
        function NgHttpProgressInterceptor($q, $injector) {
            var _this = this;
            this.$q = $q;
            this.$injector = $injector;
            this.getNgHttpProgressService = function () {
                if (_this.ngHttpProgressService == null) {
                    _this.ngHttpProgressService = _this.$injector.get('ngHttpProgress');
                }
                return _this.ngHttpProgressService;
            };
            this.request = function (config) {
                var progress = _this.getNgHttpProgressService();
                progress.start();
                return config;
            };
            this.response = function (response) {
                var progress = _this.getNgHttpProgressService();
                progress.complete();
                return response;
            };
            this.responseError = function (rejection) {
                var progress = _this.getNgHttpProgressService();
                progress.rewind();
                return _this.$q.reject(rejection);
            };
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
/// <reference path="../typings/tsd.d.ts" />
var NgHttpProgress;
(function (NgHttpProgress) {
    var NgHttpProgressService = (function () {
        /**
         * Construct the service with dependencies injected
         * @param config
         * @param $q
         * @param $timeout
         * @param ngProgress
         */
        function NgHttpProgressService(config, $q, $timeout, ngProgress) {
            this.config = config;
            this.$q = $q;
            this.$timeout = $timeout;
            this.ngProgress = ngProgress;
            this.pendingDelays = 0;
            this.stopped = false;
            this.ngProgress.color(this.config.color);
            this.ngProgress.height(this.config.height);
        }
        /**
         * Start the progress bar running
         * @returns {any}
         */
        NgHttpProgressService.prototype.start = function () {
            this.pendingDelays++;
            if (this.currentProgressDeferred) {
                if (this.stopped) {
                    this.stopped = false;
                    this.currentProgressDeferred.notify('start');
                }
                else {
                    this.currentProgressDeferred.notify('bumpback');
                }
                return this.progressPromise;
            }
            return this.initProgressMeter();
        };
        /**
         * Bump back the current status to less completed
         * @returns {number}
         */
        NgHttpProgressService.prototype.bumpBack = function () {
            var currentProgress = this.status(), fallBackTo = currentProgress - currentProgress * (currentProgress / 120);
            this.set(fallBackTo);
            return this.progressPromise;
        };
        /**
         * Halt the progress bar
         * @returns {IPromise<T>}
         */
        NgHttpProgressService.prototype.stop = function () {
            this.currentProgressDeferred.notify('stop');
            return this.progressPromise;
        };
        /**
         * Complete the progress
         * @returns {IPromise<T>}
         */
        NgHttpProgressService.prototype.complete = function () {
            this.pendingDelays--;
            if (this.pendingDelays === 0) {
                this.currentProgressDeferred.resolve();
            }
            return this.progressPromise;
        };
        /**
         * Reset the progress bar to zero
         * @returns {IPromise<T>}
         */
        NgHttpProgressService.prototype.rewind = function () {
            if (this.currentProgressDeferred) {
                this.currentProgressDeferred.reject();
            }
            return this.progressPromise;
        };
        /**
         * Get the status of the progress bar
         * @returns {number}
         */
        NgHttpProgressService.prototype.status = function () {
            return this.ngProgress.status();
        };
        NgHttpProgressService.prototype.progressStatus = function () {
            return this.progressPromise;
        };
        /**
         * Set the status of the progress bar
         * @param percentage
         */
        NgHttpProgressService.prototype.set = function (percentage) {
            var _this = this;
            this.$timeout(function () {
                _this.ngProgress.set(percentage);
            });
            return this.progressPromise;
        };
        /**
         * Finish the progress of the promise
         * @returns {IPromise<any>}
         */
        NgHttpProgressService.prototype.finish = function () {
            var _this = this;
            var finishStatus = this.status();
            this.$timeout(function () {
                _this.ngProgress.complete();
            });
            return this.$timeout(function () {
                return finishStatus;
            }, NgHttpProgressService.ngProgressFinishTime);
        };
        /**
         * Handle the reset. Immediately invoke as the ngProgress service executes immediately
         * @returns {IPromise<number>}
         */
        NgHttpProgressService.prototype.reset = function () {
            var _this = this;
            return this.$timeout(function () {
                var finishStatus = _this.status();
                _this.ngProgress.reset();
                return finishStatus;
            });
        };
        /**
         * Handle the stopping.
         * @returns {IPromise<any>}
         */
        NgHttpProgressService.prototype.halt = function () {
            var _this = this;
            this.stopped = true;
            return this.$timeout(function () {
                var currentStatus = _this.status();
                _this.ngProgress.stop();
                return currentStatus;
            });
        };
        /**
         * Intialise the progress deferred promise
         * @returns {IPromise<TResult>}
         */
        NgHttpProgressService.prototype.initProgressMeter = function () {
            var _this = this;
            this.currentProgressDeferred = this.$q.defer();
            this.ngProgress.start();
            return this.progressPromise = this.currentProgressDeferred.promise
                .then(function () {
                return _this.finish();
            }, function () {
                return _this.reset();
            }, function (action) {
                switch (action) {
                    case 'start':
                        _this.ngProgress.start();
                        break;
                    case 'stop':
                        _this.halt();
                        break;
                    case 'bumpback':
                        _this.bumpBack();
                        break;
                }
            })
                .finally(function () {
                _this.currentProgressDeferred = null; //clear the current progress
                _this.progressPromise = null; //clear the current progress
                _this.pendingDelays = 0; //reset
            });
        };
        NgHttpProgressService.ngProgressFinishTime = 1600; //time for finish to complete
        return NgHttpProgressService;
    })();
    NgHttpProgress.NgHttpProgressService = NgHttpProgressService;
})(NgHttpProgress || (NgHttpProgress = {}));
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
            this.$get = ['$q', '$timeout', 'ngProgress', function ngHttpProgressServiceFactory($q, $timeout, ngProgress) {
                    return new NgHttpProgress.NgHttpProgressService(this.config, $q, $timeout, ngProgress);
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
            var mismatchedConfig = _.xor(_.keys(config), _.keys(this.config));
            if (mismatchedConfig.length > 0) {
                throw new NgHttpProgressException("Invalid properties [" + mismatchedConfig.join(',') + "] passed to config)");
            }
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