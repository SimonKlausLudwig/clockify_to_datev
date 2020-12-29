import {Moment} from 'moment';
import * as moment from "moment";
import {Stream} from 'stream';
import ClockifyService from "./clockify.service";
import {createPDF, InterfaceEntry, merge} from "./pdf.service";


const fs = require('fs');
var tohhmmss = require('tohhmmss');

export interface InterfaceDateEntry {
    start: Moment;
    end: Moment;
    note: string;
}

export interface InterfaceTimeSheet {
    entries: InterfaceDateEntry[];
    name: string;
}


export function datev(workspace: string, month: Moment): Promise<Stream> {
    console.log("Export " + month);
    return new ClockifyService().getTimesheets(workspace, month)
        .then(timesheets => Promise.all(timesheets.map(timesheet => {
            return datesToDatev(timesheet, month);
        })).then(files => merge(files).then(file => fs.createReadStream(file))));
}

function mapToLines(timesheet: InterfaceTimeSheet): InterfaceEntry[] {
    const entries: InterfaceEntry[] = timesheet.entries.map(entry => {
        const startMoment = moment(entry.start);
        const endMoment = moment(entry.end);
        return {
            day: startMoment.format('DD.MM'),
            start: startMoment.format('hh:mm'),
            break: '00:00',
            end: endMoment.format('hh:mm'),
            duration: tohhmmss(endMoment.diff(startMoment, "seconds")).slice(0, -3),
            reason: '',
            dt: startMoment.format('DD.MM'),
            note: entry.note
        };
    });

    return entries;
}

export async function datesToDatev(timesheet: InterfaceTimeSheet, month: Moment): Promise<string> {
    return createPDF(month,
        tohhmmss([0].concat(timesheet.entries.map(i => i.end.diff(i.start, "seconds"))).reduce((a: number, b: number) => a + b)).slice(0, -3),
        timesheet.name,
        mapToLines(timesheet))
}


