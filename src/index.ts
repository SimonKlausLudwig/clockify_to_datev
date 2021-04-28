import {readFile} from 'fs';
import {renderHTML} from "./pdf.service";
import {readCSV} from "./CsvReader";

var url = require('url');
const express = require("express");
const app = express();
require('express-async-errors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

app.use((err:any, req:any, res:any, next:any) => {
    if (err.message) {
        res.status(400);
        res.json({ error: `Fehler: ${err.message}` });
    }

    next(err);
});

//TEST VIA: http://host.docker.internal:4091/
app.post('/', upload.single('csv'), async function (req:any, res:any) {
    const urlStr = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    });
    res.redirect(301, `http://host.docker.internal:9000/api/render?url=${encodeURIComponent(`${urlStr}download?file=${req.file.path}`)}`)
})

app.get("/download", async function (req: any, res: any){
    readCSV(fs.createReadStream(req.query.file)).then(d => {
        res.send(renderHTML(d));
    })
})

app.get("/", async (req: any, res: any) => {
    /*res.send(renderHTML(readCSV(" as " as any)));*/
    res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Simple Multer Upload Example</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <form action="/" enctype="multipart/form-data" method="post">
      <input type="file" name="csv">
      <input type="submit" value="Upload">
    </form>  
  </body>
</html>`)
})


readFile('./package.json', (err, packageStr) => {
    if (err) {
        console.error('There was a problem reading package json', err);
        return;
    }
    const port = 4091;
    const json = JSON.parse(packageStr.toString());
    console.log(`Running typescript-node-starter version ${json.version}`);
    app.listen(port, () => console.log(`app listening on port ${port}`));
});
