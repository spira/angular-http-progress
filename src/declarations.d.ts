declare function require(string:string):string;


declare namespace NgProgress {

    interface NgProgress {

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

}