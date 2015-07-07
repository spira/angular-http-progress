/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../dist/ngHttpProgress.d.ts" />


let expect = chai.expect;

let fixtures = {


    get customConfig():NgHttpProgress.INgHttpProgressServiceConfig{
        return {
            color: 'rgb(255, 0, 255)',
            height: '2px'
        };
    },

};

let $http:ng.IHttpService;
let $q:ng.IQService;
let $interval:ng.IIntervalService;
let $timeout:ng.ITimeoutService;
let clock:Sinon.SinonFakeTimers = sinon.useFakeTimers();

//we need to both tick setInterval and $interval as for some reason ngProgress uses both
let tickTime = (seconds) => {

    let millis = seconds * 1000;

    clock.tick(millis);
    $interval.flush(millis);
    $timeout.flush(millis);

};



describe('Custom configuration', function () {

    let ngHttpProgressProvider:NgHttpProgress.NgHttpProgressServiceProvider;
    let customProgressService:NgHttpProgress.NgHttpProgressService;

    beforeEach(() => {

        module('ngHttpProgress', (_ngHttpProgressProvider_) => {
            ngHttpProgressProvider = _ngHttpProgressProvider_; //register injection of service provider

            ngHttpProgressProvider.configure(fixtures.customConfig);

        });

    });

    beforeEach(()=>{
        inject((_ngHttpProgress_) => {
            customProgressService = _ngHttpProgress_;
        })
    });

    it('should have the configured color and height', function() {

        let element:Element =  (<any>customProgressService).ngProgress.getDomElement(),
            styledElement = jQuery(element).find('#ngProgress')
        ;
        expect(styledElement.css('backgroundColor')).to.equal(fixtures.customConfig.color);
        expect(styledElement.css('height')).to.equal(fixtures.customConfig.height);
    });


});

describe('Service tests', () => {

    let $httpBackend:ng.IHttpBackendService;
    let ngHttpProgressService:NgHttpProgress.NgHttpProgressService;


    beforeEach(()=>{

        module('ngHttpProgress');

        inject((_$httpBackend_, _ngHttpProgress_, _$http_, _$q_, _$interval_, _$timeout_) => {

            if (!ngHttpProgressService){
                $httpBackend = _$httpBackend_;
                ngHttpProgressService = _ngHttpProgress_; //register injected service provider
                $http = _$http_;
                $q = _$q_;
                $interval = _$interval_;
                $timeout = _$timeout_;
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


    describe('direct api call', () => {

        it('should start the progress bar when called directly', () => {

            let completionPromise = ngHttpProgressService.start();

            expect(completionPromise).eventually.to.be.within(0, 100);

            tickTime(2); //fast forward intervals by 2 seconds

            expect(ngHttpProgressService.status()).to.be.greaterThan(0);

        });

        it('should complete the progress bar when called', function(done) {

            expect(ngHttpProgressService.status()).to.be.greaterThan(0);

            let completionPromise = ngHttpProgressService.complete();

            expect(completionPromise).eventually.to.be.greaterThan(0); //status when the progress bar was completed

            completionPromise.then(() => {
                expect(ngHttpProgressService.status()).to.equal(100);
                done();
            });

            tickTime(2); //fast forward intervals by 2 seconds

        });

    });

    describe('$http interceptor', () => {


        it('should start the progress bar when an $http request starts', (done) => {

            $httpBackend.expectGET('/any').respond('foobar');

            expect((<any>ngHttpProgressService).progressPromise).not.to.be.ok;

            $http.get('/any');
            tickTime(2); //wait for the request to get to the interceptor

            let progressPromise = ngHttpProgressService.progressStatus();

            expect(progressPromise).to.be.ok;
            expect(progressPromise.then).to.be.instanceOf(Function);

            $httpBackend.flush();

            expect(progressPromise).eventually.to.be.greaterThan(0);

            progressPromise.then(() => {
                expect(ngHttpProgressService.status()).to.equal(0);
                done();
            });

            tickTime(2); //flush the timeouts

        });

        it('should rewind the progress bar when an $http request fails', (done) => {

            $httpBackend.expectGET('/any').respond(500, 'foobar');

            $http.get('/any');
            tickTime(2); //wait for the request to get to the interceptor

            let progressPromise = ngHttpProgressService.progressStatus();

            $httpBackend.flush();

            expect(progressPromise).eventually.to.be.fulfilled;
            expect(progressPromise).eventually.to.be.greaterThan(0);

            progressPromise.then(() => {
                expect(ngHttpProgressService.status()).to.equal(0);
                done();
            });

            tickTime(2); //flush the timeouts

        });


        it('should be able to handle multiple http requests', (done) => {

            $httpBackend.whenGET('/any').respond('foobar');

            $http.get('/any');
            tickTime(0.5); //delay dispatching the next request
            $http.get('/any');
            tickTime(0.5); //delay dispatching the next request
            $http.get('/any');
            tickTime(0.5); //delay dispatching the next request

            let progressPromise = ngHttpProgressService.progressStatus();

            expect(progressPromise).eventually.to.be.greaterThan(0);

            $httpBackend.flush();

            progressPromise.then(() => {
                done();
            });

            tickTime(2); //flush the completion timeout

        })

    });


});
