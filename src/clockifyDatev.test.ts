import * as moment from 'moment';
import {createPDF} from "./pdf.service";
import {datev} from "./clockifyDatev";
import {APP_CONFIG} from "./config/config";

const DEZ_2020 = moment().set("date", 1).set("year", 2020).set("month", 11);

describe('test clockify to datev', async () => {
    it('test convert to datev', async () => {
        await datev(APP_CONFIG.workspace,DEZ_2020);
    });
});
