import {expect} from 'chai';
import * as moment from 'moment';

const fs = require('fs');
import {readCSV} from "./CsvReader";

const DEZ_2020 = moment().set("date", 1).set("year", 2020).set("month", 11);

describe('test csv reader', async () => {
    it('test read', async () => {
        const csvInput = await readCSV(fs.createReadStream('worklogs_neu.csv'));
        console.log(JSON.stringify(csvInput));
        expect(JSON.parse(JSON.stringify(csvInput))).eqls([{
            "day": "06.04",
            "start": "01:20",
            "break": "-",
            "date": "2021-04-06T11:21:31.275Z",
            "author": "Simon Ludwig",
            "seconds": 60,
            "end": "01.21",
            "duration": "1m",
            "reason": "Script (Joseph - Innovativ)",
            "dt": "06.04",
            "note": "Simon Ludwig"
        }, {
            "day": "06.04",
            "start": "01:26",
            "break": "-",
            "date": "2021-04-06T11:27:44.223Z",
            "author": "Simon Ludwig",
            "seconds": 60,
            "end": "01.27",
            "duration": "1m",
            "reason": "Script (Joseph - Innovativ)",
            "dt": "06.04",
            "note": "Simon Ludwig"
        }, {
            "day": "01.04",
            "start": "01:48",
            "break": "-",
            "date": "2021-04-01T11:58:00.000Z",
            "author": "Simon Ludwig",
            "seconds": 600,
            "end": "01.58",
            "duration": "10m",
            "reason": "[Sprecher] Alle Sprecher sind aktuell exklusiv ohne Option das zu ändern",
            "dt": "01.04",
            "note": "Simon Ludwig"
        }, {
            "day": "01.04",
            "start": "02:13",
            "break": "-",
            "date": "2021-04-01T12:38:00.000Z",
            "author": "Simon Ludwig",
            "seconds": 1500,
            "end": "02.38",
            "duration": "25m",
            "reason": "[Startseite] Videohighlights ohne Kästen // Angebotskästen ungleich breit // Preise ungleich breit //",
            "dt": "01.04",
            "note": "Simon Ludwig"
        }, {
            "day": "01.04",
            "start": "04:13",
            "break": "-",
            "date": "2021-04-01T14:18:00.000Z",
            "author": "Simon Ludwig",
            "seconds": 300,
            "end": "04.18",
            "duration": "5m",
            "reason": "Footer - Bewertungsbadges anpassen wie im neuen Sketchfile",
            "dt": "01.04",
            "note": "Simon Ludwig"
        }, {
            "day": "06.04",
            "start": "01:27",
            "break": "-",
            "date": "2021-04-06T11:28:03.226Z",
            "author": "Simon Ludwig",
            "seconds": 60,
            "end": "01.28",
            "duration": "1m",
            "reason": "Footer - Bewertungsbadges anpassen wie im neuen Sketchfile",
            "dt": "06.04",
            "note": "Simon Ludwig"
        }]);
    });
});
