import {DatevEntry} from "./Entry";

var Mustache = require('mustache');
const fs = require('fs')
var tohhmmss = require('tohhmmss');

export const    renderHTML =  (entries: DatevEntry[]) => {
    const html = fs.readFileSync(`index.html`, 'utf8')
    return Mustache.render(html, {
        company: "thebakers UG (haftungsbeschränkt)",
        name: entries[0].author,
        total: tohhmmss(entries.map(i => i.seconds).reduce((a, b) => a + b, 0)).slice(0, -3),
        month: entries[0].date.format("MMMM YYYY"),
        entries: entries.sort((a,b) => a.date.valueOf() - b.date.valueOf())
    });
}
