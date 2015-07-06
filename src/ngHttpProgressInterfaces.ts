module NgHttpProgress {

    export interface INgHttpProgressService {
        start(): boolean;
        stop(): boolean;
        complete(): boolean;
        reset(): boolean;
        status(): number;
        set(): boolean;
    }

    export interface IngHttpProgressServiceProvider {
        configure(config:INgHttpProgressServiceConfig): NgHttpProgressServiceProvider;
    }

    export interface INgHttpProgressServiceConfig {
        color?: string;
        height?: string;
    }

}
