import * as moment from 'moment';
import {Moment} from 'moment';
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
    return new ClockifyService().getTimesheets(workspace, month)
        .then(timesheets => Promise.all(timesheets.map(timesheet => {
            return datesToDatev(timesheet,month);
        })).then(files => merge(files).then(file => fs.createReadStream(file))));
}

function mapToLines(timesheet: InterfaceTimeSheet): InterfaceEntry[] {
    const entries: InterfaceEntry[] = timesheet.entries.map(entry => {
        const startMoment = moment(entry.start);
        const endMoment = moment(entry.end);
        return {
            dayOfMonth: startMoment.date(), entries: [[startMoment.format('DD.MM'),
                startMoment.format('hh:mm'),
                '',
                endMoment.format('hh:mm'),
                tohhmmss(endMoment.diff(startMoment, "seconds")),
                '',
                '',
                entry.note
            ]]
        };
    });

    return entries;
}

function groupLines(entries: InterfaceEntry[]): InterfaceEntry[] {
    const result: InterfaceEntry[] = [];
    entries.forEach(entry => {
        const existing = result.filter(resultEntry => resultEntry.dayOfMonth === entry.dayOfMonth);
        if (existing.length >= 1) {
            existing[0].entries.push(entry.entries[0]);
        } else {
            result.push(entry);
        }
    });
    return result;
}

export function datesToDatev(timesheet: InterfaceTimeSheet, month: Moment): string {
    return createPDF(month,
        tohhmmss(12),
        'thebakers UG (haftungsbeschränkt)',
        timesheet.name,
        groupLines(mapToLines(timesheet)));
}


