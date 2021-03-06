/// <reference path="../typings/tsd.d.ts" />

module NgHttpProgress {

    export interface ngProgress {
        start():void;
        height(cssHeight:string):void
        color(cssColor:string):void
        status():number;
        stop():void;
        set(percentage:number):void;
        reset():void;
        complete():void;
        getDomElement():Element;
    }

    export interface INgHttpProgressService {
        start(): ng.IPromise<number>;
        stop(): ng.IPromise<number>;
        complete(): ng.IPromise<number>;
        rewind(): ng.IPromise<number>;
        status(): number;
        set(percentage:number):void;
    }

    export interface IngHttpProgressServiceProvider {
        configure(config:INgHttpProgressServiceConfig): NgHttpProgressServiceProvider;
    }

    export interface INgHttpProgressServiceConfig {
        color?: string;
        height?: string;
    }

}
