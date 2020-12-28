import {APP_CONFIG} from "./config/config";
import {ClockifyApi} from "clockify-api/dist";
import * as moment from "moment";
import {Moment} from "moment";
import {InterfaceDateEntry, InterfaceTimeSheet} from "./clockifyDatev";

const clockify = new ClockifyApi(APP_CONFIG.apikey);

export interface UserInterface {
    name: string,
    id: string
}

export default class ClockifyService {
    getUsersByWorkspace(workspace: string): Promise<UserInterface[]> {
        return clockify.workspaces(workspace).users().then(users => {
            return users.map(user => ({name: user.name, id: user.id}));
        })
    }

    getTimeEntries(user: string, month: Moment): Promise<InterfaceDateEntry[]> {
        return clockify.workspaces(APP_CONFIG.workspace as string)
            .user(user).timeEntries.get({
                start: moment(month).set('date', 0).toISOString(),
                end: (moment(month).set('date', moment(month).daysInMonth()).toISOString())
            }).then(entries => {
                const timeEntries = entries.map(entry => {
                    const timeEntry: InterfaceDateEntry = {
                        start: moment(entry.timeInterval.start),
                        end: moment(entry.timeInterval.end),
                        note: entry.description
                    };
                    return timeEntry;
                });
                return timeEntries;
            })
    }

    getTimesheets(workspace: string, month: Moment): Promise<InterfaceTimeSheet[]> {
        return this.getUsersByWorkspace(workspace).then(users => {
            return Promise.all(users.map(user => {
                return this.getTimeEntries(user.id, month).then(entries => {
                    const sheet: InterfaceTimeSheet = {
                        name: user.name,
                        entries: entries
                    }
                    return sheet;
                })
            }))
        })
    }
}
