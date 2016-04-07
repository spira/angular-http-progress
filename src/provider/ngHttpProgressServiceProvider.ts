import * as _ from "lodash";
import {NgHttpProgressService} from "../service/ngHttpProgressService";

export interface INgHttpProgressServiceConfig {
    color?:string; //eg "FF0000"
    height?:string; //eg "10px"
}

export declare class Error {
    public name:string;
    public message:string;
    public stack:string;

    constructor(message?:string);
}

export class NgHttpProgressException extends Error {

    constructor(public message:string) {
        super(message);
        this.name = 'NgHttpProgressException';
        this.message = message;
        this.stack = (<any>new Error()).stack;
    }

    toString() {
        return this.name + ': ' + this.message;
    }
}

export class NgHttpProgressServiceProvider implements ng.IServiceProvider {

    private config:INgHttpProgressServiceConfig;

    /**
     * Initialise the service provider
     */
    constructor() {

        //initialise service config
        this.config = {
            color: '#FF0000',
            height: '10px'
        };

    }

    /**
     * Set the configuration
     * @param config
     * @returns {NgHttpProgressServiceProvider}
     */
    public configure(config:INgHttpProgressServiceConfig):this {

        let mismatchedConfig = _.xor(_.keys(config), _.keys(this.config));
        if (mismatchedConfig.length > 0) {
            throw new NgHttpProgressException("Invalid properties [" + mismatchedConfig.join(',') + "] passed to config)");
        }

        this.config = _.defaults(config, this.config);
        return this;
    }

    public $get = ['$q', '$timeout', /*'ngProgress',*/ function ngHttpProgressServiceFactory($q, $timeout/*, ngProgress*/) {
        return new NgHttpProgressService(this.config, $q, $timeout/*, ngProgress*/);
    }];

}



