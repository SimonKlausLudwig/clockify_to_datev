import {readFile} from 'fs';
import * as os from 'os';
import * as moment from 'moment';
import {datev} from "./clockifyDatev";
import {APP_CONFIG} from "./config";

const express = require("express");
const app = express();
const port = 3000;

app.get("/api/export", async (req: any, res: any) => {
    res.setHeader('Content-disposition', `inline; filename="Zeiten"`);
    res.setHeader('Content-type', 'application/pdf');
    datev(APP_CONFIG.workspace, moment().set('month',req.params.month)).then(stream => stream.pipe(res));
})


readFile('./package.json', (err, packageStr) => {
    if (err) {
        console.error('There was a problem reading package json', err);
        return;
    }

    const json = JSON.parse(packageStr.toString());

    console.log(`Running typescript-node-starter version ${json.version}`);
    console.info(`Running on ${os.hostname()} with ${os.cpus().length} CPU's and ${os.totalmem()} mem`);
    app.listen(port, () => console.log(`app listening on port ${port}`));
});
