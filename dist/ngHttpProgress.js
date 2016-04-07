"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
require("angular");
require("ngprogress/main/ngProgress.js");
var ngHttpProgressServiceProvider_1 = require("./provider/ngHttpProgressServiceProvider");
var ngHttpProgressInterceptor_1 = require("./interceptor/ngHttpProgressInterceptor");
__export(require("./provider/ngHttpProgressServiceProvider"));
__export(require("./service/ngHttpProgressService"));
__export(require("./interceptor/ngHttpProgressInterceptor"));
angular.module('ngHttpProgress', ['ngProgress'])
    .provider('ngHttpProgress', ngHttpProgressServiceProvider_1.NgHttpProgressServiceProvider)
    .service('ngHttpProgressInterceptor', ngHttpProgressInterceptor_1.NgHttpProgressInterceptor)
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('ngHttpProgressInterceptor');
    }]);

//# sourceMappingURL=ngHttpProgress.js.map
