import ClockifyService from "./clockify.service";
import {APP_CONFIG} from "./config/config";
import {expect} from "chai";
import * as moment from 'moment';
//simon-ludwig+1@live.de
//simon-ludwig+2@live.de
//Simon123
const DEZ_2020 = moment().set("date", 1).set("year", 2020).set("month", 11);

describe('test clockify service', async () => {
    it('test get workspace users', async () => {
        const users = await new ClockifyService().getUsersByWorkspace(APP_CONFIG.workspace);
        expect(users).eql(['5fe49eb184f8d337255a4518', '5fe49e7adfb3491ca86ed812']);
    });

    it('test get timeentries for user', async () => {
        const timeEntries = await new ClockifyService().getTimeEntries("5fe49eb184f8d337255a4518", DEZ_2020);
        expect(timeEntries).length(2);
        expect(timeEntries[0].note).eq("test 2");
        expect(timeEntries[1].note).eq("test 1");
    })

    it('test getTimesheets', async () => {
        const timesheet = await new ClockifyService().getTimesheets(APP_CONFIG.workspace, DEZ_2020);
        expect(timesheet).eql([
            {
                "name": "Simon Ludwig 2",
                entries: [
                    {start: timesheet[0].entries[0].start, end: timesheet[0].entries[0].end, note: "test 2"},
                    {start: timesheet[0].entries[1].start, end: timesheet[0].entries[1].end, note: "test 1"}
                ]
            },
            {
                "entries": [],
                "name": "Simon-ludwig+1"
            }
        ])
    })

    it('test for invalid month', async () => {

    })
})
;
