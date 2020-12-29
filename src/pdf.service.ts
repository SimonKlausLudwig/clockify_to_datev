import {Moment} from "moment";
import * as moment from 'moment';
import {APP_CONFIG} from "./config/config";

var Mustache = require('mustache');
const puppeteer = require('puppeteer')
const fs = require('fs')

const tmp = require('tmp');
const PDFMerger = require('pdf-merger-js');


export interface InterfaceEntry {
    day: string;
    start: string,
    break: string,
    end: string,
    duration: string,
    reason: string,
    dt: string,
    note: string
}

export async function merge(files: string[]): Promise<string> {
    const file = tmp.fileSync({postfix: '.pdf'});
    var merger = new PDFMerger();
    files.forEach(file => {
        console.log(`merge ${file}`)
        merger.add(file);
    })


    console.log("merge files to " + file.name);
    return merger.save(file.name).then(() => file.name)
}

export async function createPDF(month: Moment, total: string, name: string, entries: InterfaceEntry[]): Promise<string> {
    const file = tmp.fileSync({postfix: '.pdf'});

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'], // This was important. Can't remember why
    })

    // create a new page
    const page = await browser.newPage()

    // set your html as the pages content
    const html = fs.readFileSync(`index.html`, 'utf8')

    await page.setContent(Mustache.render(html, {
        company: APP_CONFIG.companyName,
        name: name,
        total: total,
        month: month.format("DD. MMMM"),
        entries: entries
    }), {
        waitUntil: 'domcontentloaded'
    })

    // create a pdf buffer
    const pdfBuffer = await page.pdf({
        format: 'A4'
    })


    // or a .pdf file
    await page.pdf({
        format: 'A4',
        path: file.name
    })

    // close the browser
    await browser.close();

    console.log("Exported to file " + file.name)
    return file.name;
}
