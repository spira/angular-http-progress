/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../dist/ngHttpProgress.d.ts" />


let expect = chai.expect;

let fixtures = {


    get foo(){
        return 'bar';
    },

};


describe('Service tests', () => {

    let $httpBackend:ng.IHttpBackendService;
    let ngHttpProgressService:NgHttpProgress.NgHttpProgressService;

    beforeEach(()=>{

        module('ngHttpProgress');

        inject((_$httpBackend_, _ngHttpProgress_) => {

            if (!ngHttpProgressService){ //dont rebind, so each test gets the singleton
                $httpBackend = _$httpBackend_;
                ngHttpProgressService = _ngHttpProgress_; //register injected of service provider
            }
        });

    });

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('Initialisation', () => {

        it('should be an injectable service', () => {

            return expect(ngHttpProgressService).to.be.an('object');
        });

    });


});
