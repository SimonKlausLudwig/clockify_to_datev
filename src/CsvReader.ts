import {Stream} from "stream";
import {DatevEntry} from "./Entry";
import * as moment from "moment";
const csv = require('csv-parser');

export const readCSV = (stream: Stream): Promise<DatevEntry[]> => {
    const list: DatevEntry[] = [];
    return new Promise(r => {
        stream
            .pipe(csv())
            .on('data', (row: { Started: string, Summary: string, "Time spent": string, "Time spent seconds": string, "'Work description'"?: string }) => {
                if ((Object.values(row)[0]?.length || 0) <= 0) {

                } else {
                    const start = moment(row["Started"]);
                    const seconds = Number.parseInt(row["Time spent seconds"]);
                    const author = Object.values(row)[0] as string;
                    const t: DatevEntry = {
                        day: start.format('DD.MM'),
                        start: start.format('hh:mm'),
                        break: "-",
                        date: start,
                        author: author,
                        seconds: seconds,
                        end: start.add(seconds, "second").format("hh.mm"),
                        duration: row["Time spent"],
                        reason: row["Summary"],
                        dt: moment(row["Started"]).format('DD.MM'),
                        note: author + "" + (row["'Work description'"] || "")
                    }
                    list.push(t);
                }
            })
            .on('end', () => {
                r(list);
            });

    })
}
