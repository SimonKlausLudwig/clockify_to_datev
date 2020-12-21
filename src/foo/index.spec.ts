import {addTimeEntry, datev, getTimeEntries} from "./index";
import {expect} from "chai";
import moment from "moment";

describe("test clockify", async () => {

    it("test edit timeentry for user", async () => {
        await addTimeEntry("Felix", "VB-123", 100).then(data => {
            console.log(data);
        })
    })

    it("test datev", async () => {
        await datev("5eea862a12d51237f831b8be", moment().set('month',11));
    })

    it("testt get time entries", async () => {
        const Name = "TEST_" + Math.floor(Math.random() * (9999999 - 1 + 1)) + 1;
        await addTimeEntry(Name, "VB-123", 100);
        const entries = await getTimeEntries(Name);
        console.log(entries);
        expect(entries).length(1);
        expect(entries[0]).eql({
            duration: 100,
            start: entries[0].start,
            end: entries[0].end,
            description: 'VB-123',
            tags: [Name]
        });
    })

    it("test get all tiime entries", async () => expect((await getTimeEntries()).length).greaterThan(10))

});