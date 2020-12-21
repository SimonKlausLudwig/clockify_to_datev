import moment, { Moment } from "moment";
import TimeEntry from "./time";

import {ClockifyApi} from 'clockify-api/dist';

const fs = require('fs');
import {time} from "../../../../../admin-ui/src/components/project/messages/message/header/style.css";
import {DateEntry, datesToDatev} from "./clockifyDatev";
import {overlayFile} from "../../pdf/pdf.service";
import {Stream} from "stream";

const clockify = new ClockifyApi('Xj3lsJ/auRPYEeXq');

export function addTimeEntry(user: string, epic: string, minutes: number): Promise<boolean> {
    return null;
}


export function datev(user: string, month: Moment): Promise<Stream> {
    return clockify.workspaces("5d4c036e9663e2139c247cb5")
        .user(user).timeEntries.get({
            start: moment(month).set("date", 0).toISOString(),
            end: (moment(month).set("date", moment(month).daysInMonth()).toISOString())
        }).then((entries => {
            const timeEntries = entries.map(entry => {
                const timeEntry: DateEntry = {
                    start: moment(entry.timeInterval.start),
                    end: moment(entry.timeInterval.end),
                    note: entry.description
                };
                return timeEntry;
            })
            return fs.createReadStream(datesToDatev({
                name: "Ferhat Kocak",
                entries: timeEntries
            }))
        }))
}

export function getTimeEntries(user?: string): Promise<TimeEntry[]> {
    return null;
}