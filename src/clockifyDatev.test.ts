import * as moment from 'moment';
import { createPDF } from './clockifyDatev';

describe('test clockify to datev', async () => {
    it('test convert to datev', async () => {
        await createPDF(moment(), '121', 'thebakers', 'Simon', [
            {
                dayOfMonth: 1,
                entries: [['1', '2', '3', '4', '5', '6', '7', '8']]
            }
        ]);
    });
});
