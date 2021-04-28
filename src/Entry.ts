import {Moment} from "moment";

export interface DatevEntry {
    date: Moment,
    author: string,
    seconds: number,
    day: string;
    start: string,
    break: string,
    end: string,
    duration: string,
    reason: string,
    dt: string,
    note?: string
}
