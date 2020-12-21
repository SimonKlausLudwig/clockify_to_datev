import {Moment} from 'moment';
import * as moment from 'moment';
const HummusRecipe = require('hummus-recipe');

import { ClockifyApi } from 'clockify-api/dist';
import { Stream } from 'stream';

const fs = require('fs');

const clockify = new ClockifyApi(process.env.APIKEY as string);

//'Xj3lsJ/auRPYEeXq'
//'5d4c036e9663e2139c247cb5'


export function datev (user: string, month: Moment): Promise<Stream> {
    return clockify.workspaces(process.env.WORKSPACE as string)
        .user(user).timeEntries.get({
            start: moment(month).set('date', 0).toISOString(),
            end: (moment(month).set('date', moment(month).daysInMonth()).toISOString())
        }).then((entries => {
            const timeEntries = entries.map(entry => {
                const timeEntry: InterfaceDateEntry = {
                    start: moment(entry.timeInterval.start),
                    end: moment(entry.timeInterval.end),
                    note: entry.description
                };
                return timeEntry;
            });
            return fs.createReadStream(datesToDatev({
                name: 'Ferhat Kocak',
                entries: timeEntries
            }));
        }));
}

export interface InterfaceDateEntry {
    start: Moment;
    end: Moment;
    note: string;
}

export interface InterfaceTimeSheet {
    entries: InterfaceDateEntry[];
    name: string;
}

const VERTICAL_SPACINGS = 17;
const HORIZONTAL_POSITIONS = [76, 113, 160, 202, 242, 291, 312, 372];

interface InterfaceEntry {
    dayOfMonth: number;
    entries: [string, string, string, string, string, string, string, string][];
}

export function datesToDatev (timesheet: InterfaceTimeSheet): string {
    let totalTime: any = null;
    const entries: InterfaceEntry[] = timesheet.entries.map(entry => {
        const startMoment = moment(entry.start);
        const endMoment = moment(entry.end);


        totalTime += endMoment.diff(startMoment, 'second');

        return {
            dayOfMonth: startMoment.date(), entries: [[startMoment.format('DD.MM'),
                startMoment.format('hh:mm'),
                '',
                endMoment.format('hh:mm'),
                `${moment.utc(endMoment.diff(startMoment)).format('HH:mm')}`,
                '',
                '',
                entry.note
            ]]
        };
    });

    const result: InterfaceEntry[] = [];

    entries.forEach(entry => {
        const existing = result.filter(resultEntry => resultEntry.dayOfMonth === entry.dayOfMonth);
        if (existing.length >= 1) {
            existing[0].entries.push(entry.entries[0]);
        } else {
            result.push(entry);
        }
    });


    const totalTimeF = new Date(totalTime * 1000).toISOString().substr(11, 8);
    return createPDF(moment(timesheet.entries[0].start),
        toHHMMSS(totalTime),
        'thebakers UG (haftungsbeschränkt)',
        timesheet.name,
        result);
}

const toHHMMSS = (sec_num: number) => {
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor(sec_num / 60) % 60;
    const seconds = sec_num % 60;

    return [hours, minutes, seconds]
        .map(v => v < 10 ? '0' + v : v)
        .filter((v, i) => v !== '00' || i > 0)
        .join(':');
};

export function createPDF (month: Moment, totalTime: string, company: string, name: string, entries: { dayOfMonth: number, entries: [string, string, string, string, string, string, string, string][] }[]): string {
    const pdfDoc = new HummusRecipe('./template.pdf', './datev.pdf');
    const temp = pdfDoc
        .editPage(1);

    const FONT = {
        color: '#000000',
        fontSize: 5,
        height: 15,
        font: 'Helvetica'
    };

    temp.text(company, 200, 50, FONT);

    temp.text(name, 200, 67, FONT);

    temp.text(month.locale('de').format('MMMM YYYY'), 310, 84, FONT);

    temp.text(totalTime, 238, 642, FONT);

    for (let i = 1; i <= month.daysInMonth(); i++) {
        const posY = 104 + (i * VERTICAL_SPACINGS);
        for (let j = 0; j <= HORIZONTAL_POSITIONS.length; j++) {
            const timeEntry = entries.filter(entry => entry.dayOfMonth === i)[0];
            const column = timeEntry?.entries.map(entry => entry[j]);
            const value = j === 0 ? month.locale('de').set('date', i).format('DD.MM') : column?.join('\r\n') || '-';
            temp.text(value, HORIZONTAL_POSITIONS[j], posY - (i / 4), {
                ...FONT,
                fontSize: column?.length >= 4 ? 2 : column?.length >= 3 ? 5 : FONT.fontSize
            });
        }
    }

    temp.endPage();

    pdfDoc.endPDF();

    return './datev.pdf';
}
