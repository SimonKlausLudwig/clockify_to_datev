import {Moment} from "moment";

const HummusRecipe = require('hummus-recipe');
const VERTICAL_SPACINGS = 17;

const HORIZONTAL_POSITIONS = [76, 113, 160, 202, 242, 291, 312, 372];
const VERTICAL_START = 104;
const VERTICAL_POSITIONS = [17, 34, 51, 68, 85, 102, 119, 136, 153, 170, 187, 204, 221, 238, 255, 272, 289, 306, 323, 340, 357, 374, 391, 408, 425, 442, 459, 476, 493, 510, 527];

const tmp = require('tmp');
const PDFMerger = require('pdf-merger-js');


export interface InterfaceEntry {
    dayOfMonth: number;
    entries: [string, string, string, string, string, string, string, string][];
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

export function createPDF(month: Moment, totalTime: string, company: string, name: string, entries: InterfaceEntry[]): string {

    const file = tmp.fileSync({postfix: '.pdf'});

    const pdfDoc = new HummusRecipe('./template.pdf', file.name);
    const temp = pdfDoc
        .editPage(1);


    const DEFAULT_FONT_SIZE = 10;

    const FONT = {
        color: '#000000',
        fontSize: DEFAULT_FONT_SIZE,
        height: 300,
        font: 'Helvetica'
    };

    temp.text(company, 200, 50, FONT);

    temp.text(name, 200, 67, FONT);

    temp.text(month.locale('de').format('MMMM YYYY'), 310, 84, FONT);

    temp.text(totalTime, 238, 642, FONT);

    for (let i = 0; i < month.daysInMonth(); i++) {
        const dayOfMonth = i + 1;
        const posY = VERTICAL_POSITIONS[i] + VERTICAL_START;
        for (let j = 0; j <= HORIZONTAL_POSITIONS.length; j++) {
            const timeEntry = entries.filter(entry => entry.dayOfMonth === dayOfMonth)[0];
            const column = timeEntry?.entries.map(entry => entry[j]);
            const value = j === 0 ? month.locale('de').set('date', dayOfMonth).format('DD.MM') : column?.join('\r\n') || '-';
            temp.text(value, HORIZONTAL_POSITIONS[j], posY, {
                ...FONT,
                fontSize: j === 0 ? DEFAULT_FONT_SIZE : column?.length >= 4 ? 2 : column?.length >= 3 ? 5 : FONT.fontSize
            });
        }
    }

    temp.endPage();

    pdfDoc.endPDF();

    console.log("Exported to " + file.name);
    return file.name;
}
