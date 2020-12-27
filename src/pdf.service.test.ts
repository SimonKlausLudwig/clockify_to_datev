import * as moment from 'moment';
import {createPDF} from "./pdf.service";

//simon-ludwig+1@live.de
//simon-ludwig+2@live.de
//Simon123
var fc = require('filecompare');
const fs = require('fs');
const pdf = require('pdf-parse');

const DEZ_2020 = moment().set("date", 1).set("year", 2020).set("month", 11);

describe('test clockify service', async () => {
    it('test create pdf', async () => {
        const file = await createPDF(DEZ_2020, "12:00", "Simon Ludwig", [
            {
                dayOfMonth: 1, entries: [
                    ["1", "2", "3", "4", "5", "6", "7", "8"],
                    ["1", "2", "3", "4", "5", "6", "7", "8"],
                    ["1", "2", "3", "4", "5", "6", "7", "8"],
                    ["1", "2", "3", "4", "5", "6", "7", "8"],
                    ["1", "2", "3", "4", "5", "6", "7", "8"],
                ]
            },
            {
                dayOfMonth: 6, entries: [
                    ["1", "2", "3", "4", "5", "6", "7", "8"]
                ]
            }
        ])


        var cb = function(isEqual: boolean) {
            console.log("equal? :" + isEqual);
        }
        fc("compare-1.pdf",file,cb);
    });
});
