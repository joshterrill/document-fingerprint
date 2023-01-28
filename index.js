require('dotenv').config();
const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const util = require('./util');
const app = express();

const port = process.env.PORT || 3000;

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    safeFileNames: true,
    preserveExtension: true,
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/demo.html'));
});

app.get('/demo/download/:id', (req, res) => {
    const cookies = req.headers['cookie'].replace(/ /g, '').split(';');
    const firstName = cookies.find(c => c.includes('firstName')).split('=')[1];
    const lastName = cookies.find(c => c.includes('lastName')).split('=')[1];
    const userId = cookies.find(c => c.includes('userId')).split('=')[1];
    const message = `FirstName: ${firstName} | LastName: ${lastName} | UserId: ${userId}`;
    const fileRead = fs.readFileSync(`./views/demo-files/${req.params.id}.pdf`, { encoding: 'hex' });
    const file = util.addIDToFile(fileRead, message);
    const fileName = `${req.params.id}.pdf`;
    res.writeHead(200, {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': 'application/pdf',
    });
    res.end(file);
});

app.post('/v0.0.1/upload', (req, res) => {
    const { message } = req.body;
    const file = util.addIDToFile(req.files.file, message);
    const fileName = req.files.file.name;
    res.writeHead(200, {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': 'application/pdf',
    });
    res.end(file);
});

app.post('/v0.0.1/decode', (req, res) => {
    const decoded = util.readIDFromFile(req.files.file);
    res.send(decoded);
});

app.listen(port, () => console.log(`listening on port ${port}`));
