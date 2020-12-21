import moment, {Moment} from "moment";

const HummusRecipe = require('hummus-recipe');
const fs = require('fs');

export interface DateEntry {
    start: Moment,
    end: Moment,
    note: string
}

export interface TimeSheet {
    entries: DateEntry[],
    name: string
}

const VERTICAL_SPACINGS = 17;
const HORIZONTAL_POSITIONS = [76, 113, 160, 202, 242, 291, 312, 372]
const ROWS = 31;

interface Entry {
    dayOfMonth: number,
    entries: [string, string, string, string, string, string, string, string][]
}

export function datesToDatev(timesheet: TimeSheet): string {
    let totalTime: any = null;
    const entries: Entry[] = timesheet.entries.map(entry => {
        const startMoment = moment(entry.start);
        const endMoment = moment(entry.end);


        totalTime += endMoment.diff(startMoment, "second");

        return {
            dayOfMonth: startMoment.date(), entries: [[startMoment.format("DD.MM"),
                startMoment.format("hh:mm"),
                "",
                endMoment.format("hh:mm"),
                `${moment.utc(endMoment.diff(startMoment)).format("HH:mm")}`,
                "",
                "",
                entry.note
            ]]
        }
    });

    const result: Entry[] = [];

    entries.forEach(entry => {
        const existing = result.filter(resultEntry => resultEntry.dayOfMonth === entry.dayOfMonth);
        if (existing.length >= 1) {
            existing[0].entries.push(entry.entries[0]);
        } else {
            result.push(entry);
        }
    })


    const totalTimeF = new Date(totalTime * 1000).toISOString().substr(11, 8);
    return createPDF(moment(timesheet.entries[0].start),
        toHHMMSS(totalTime),
        "thebakers UG (haftungsbeschränkt)",
        timesheet.name,
        result)
}

const toHHMMSS = (sec_num: number) => {
    const hours = Math.floor(sec_num / 3600)
    const minutes = Math.floor(sec_num / 60) % 60
    const seconds = sec_num % 60

    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v, i) => v !== "00" || i > 0)
        .join(":")
}

export function createPDF(month: Moment, totalTime: string, company: string, name: string, entries: { dayOfMonth: number, entries: [string, string, string, string, string, string, string, string][] }[]): string {
    const pdfDoc = new HummusRecipe('./src/api/clockify/datev.pdf', 'output.pdf');
    const temp = pdfDoc
        .editPage(1);

    const FONT = {
        color: "#000000",
        fontSize: 5,
        height: 15,
        font: 'Helvetica'
    };

    temp.text(company, 200, 50, FONT)

    temp.text(name, 200, 67, FONT)

    temp.text(month.locale("de").format("MMMM YYYY"), 310, 84, FONT)

    temp.text(totalTime, 238, 642, FONT)

    for (let i = 1; i <= month.daysInMonth(); i++) {
        const posY = 104 + (i * VERTICAL_SPACINGS)
        for (let j = 0; j <= HORIZONTAL_POSITIONS.length; j++) {
            const timeEntry = entries.filter(entry => entry.dayOfMonth === i)[0];
            const column = timeEntry?.entries.map(entry => entry[j]);
            const value = j === 0 ? month.locale("de").set('date', i).format("DD.MM") : column?.join("\r\n") || "-"
            temp.text(value, HORIZONTAL_POSITIONS[j], posY - (i / 4), {
                ...FONT,
                fontSize: column?.length >= 4 ? 2 : column?.length >= 3 ? 5 : FONT.fontSize
            })
        }
    }

    temp.endPage();

    pdfDoc.endPDF();

    new HummusRecipe('./output.pdf', './dist/timesheet.pdf')
        .endPDF();

    return "./dist/timesheet.pdf";
}