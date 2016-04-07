import {Chance} from "chance"
import {INgHttpProgressServiceConfig} from "./provider/ngHttpProgressServiceProvider";

export const seededChance:Chance.Chance = new Chance(1);

export const fixtures = {

    get customConfig():INgHttpProgressServiceConfig{
        return {
            color: 'rgb(255, 0, 255)',
            height: '2px'
        };
    },

};