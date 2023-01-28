// TODO: this is just for PDF's, need to add support for other file types
const EOF = '2525454f460a';
const END_OBJ = '656e646f626a0a787265660a';

const HEX_ID = process.env.HEX_ID;
const SECURITY_KEY = process.env.SECURITY_KEY;

module.exports = {
    EOF,
    END_OBJ,
    SECURITY_KEY,
    HEX_ID,
}