/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./ngHttpProgressInterfaces.ts" />

module NgHttpProgress {

    export class NgHttpProgressInterceptor {

        private ngHttpProgressService: NgHttpProgressService;


        /**
         * Construct the service with dependencies injected
         * @param _$q
         * @param _$injector
         */
        static $inject = ['$q', '$injector'];
        constructor(
            private $q: ng.IQService,
            private $injector: ng.auto.IInjectorService) {

        }

        private getNgHttpProgressService = (): NgHttpProgressService=> {
            if (this.ngHttpProgressService == null) {
                this.ngHttpProgressService = this.$injector.get('ngHttpProgress');
            }
            return this.ngHttpProgressService;
        };

        public request = (config):any => {

            let progress = this.getNgHttpProgressService();

            progress.start();

            return config;
        };

        public response = (response):any => {

            let progress = this.getNgHttpProgressService();
            progress.complete();

            return response;
        };

        public responseError = (response):any => {

            let progress = this.getNgHttpProgressService();
            progress.rewind();

            return response;
        };

    }

}
