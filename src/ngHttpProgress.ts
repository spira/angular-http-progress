import "angular";
// import "ngprogress"

import {NgHttpProgressServiceProvider} from "./provider/ngHttpProgressServiceProvider";
import {NgHttpProgressInterceptor} from "./interceptor/ngHttpProgressInterceptor";

export * from "./provider/ngHttpProgressServiceProvider";
export * from "./service/ngHttpProgressService";
export * from "./interceptor/ngHttpProgressInterceptor";

angular.module('ngHttpProgress', [/*'ngProgress'*/])
    .provider('ngHttpProgress', NgHttpProgressServiceProvider)
    .service('ngHttpProgressInterceptor', NgHttpProgressInterceptor)
    .config(['$httpProvider', ($httpProvider:ng.IHttpProvider) => {

        $httpProvider.interceptors.push('ngHttpProgressInterceptor');
    }])
;