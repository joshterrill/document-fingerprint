require('dotenv').config();
const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const util = require('./util');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('views'));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    safeFileNames: true,
    preserveExtension: true,
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', (req, res) => {
    const { message } = req.body;
    const file = util.addIDToFile(req.files.file, message);
    const fileName = req.files.file.name;
    res.writeHead(200, {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': 'application/pdf',
    });
    res.end(file);
});

app.post('/decode', (req, res) => {
    const decoded = util.readIDFromFile(req.files.file);
    res.send(decoded);
});

app.listen(port, () => console.log(`listening on port http://localhost:${port}`));
