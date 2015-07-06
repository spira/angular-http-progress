/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./ngHttpProgressInterfaces.ts" />

module NgHttpProgress {

    export class NgHttpProgressInterceptor {

        //list injected dependencies
        private $q: ng.IQService;
        private $injector: ng.auto.IInjectorService;
        private ngHttpProgressService: NgHttpProgressService;


        /**
         * Construct the service with dependencies injected
         * @param _$q
         * @param _$injector
         */
        static $inject = ['$q', '$injector'];
        constructor(_$q: ng.IQService, _$injector: ng.auto.IInjectorService) {

            this.$q = _$q;
            this.$injector = _$injector;
        }

        private getNgHttpProgressService = (): NgHttpProgressService=> {
            if (this.ngHttpProgressService == null) {
                this.ngHttpProgressService = this.$injector.get('ngHttpProgressService');
            }
            return this.ngHttpProgressService;
        };

        public request = (config):any => {

            let ngHttpProgressService = this.getNgHttpProgressService();
            //@todo start progress bar

            return config;
        };

        public response = (response):any => {

            let ngHttpProgressService = this.getNgHttpProgressService();
            //@todo advance progress bar to end

            return response;
        };

        public responseError = (response):any => {

            let ngHttpProgressService = this.getNgHttpProgressService();
            //@todo rewind progress bar

            return response;
        };

    }

}
