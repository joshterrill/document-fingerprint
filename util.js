require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');
const CONSTANTS = require('./constants');

const initVector = crypto.randomBytes(16);

function utf8ToHex(str) {
    return Array.from(str).map(c => 
      c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) : encodeURIComponent(c).replace(/\%/g,'').toLowerCase()
    ).join('');
}

function encryptText(message) {
    const securityKey = Buffer.from(process.env.SECURITY_KEY, 'hex');
    const cipher = crypto.createCipheriv(process.env.ALGORITHM, securityKey, initVector);
    let encryptedData = cipher.update(message, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
}

function decryptText(encryptedMessage) {
    const securityKey = Buffer.from(process.env.SECURITY_KEY, 'hex');
    const decipher = crypto.createDecipheriv(process.env.ALGORITHM, securityKey, initVector);
    let decryptedData = decipher.update(encryptedMessage, 'hex', 'utf-8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
}

function addIDToFile(file, message) {
    // const file = fs.readFileSync('file.pdf', { encoding: 'hex' });
    const fileBuffer = file.data.toString('hex');
    const eofIndex = fileBuffer.indexOf(CONSTANTS.EOF);
    const endObjIndex = fileBuffer.lastIndexOf(CONSTANTS.END_OBJ, eofIndex) + CONSTANTS.END_OBJ.length;
    const insertedText = utf8ToHex(message);
    const newFile = fileBuffer?.slice(0, endObjIndex) + `${CONSTANTS.HEX_ID}${encryptText(insertedText)}${CONSTANTS.HEX_ID}` + fileBuffer.slice(endObjIndex);
    const newFileBuffer = Buffer.from(newFile, 'hex')

    return newFileBuffer;
}


function readIDFromFile(file) {
    const fileBuffer = file.data.toString('hex');
    const oddballOne = fileBuffer.indexOf(CONSTANTS.HEX_ID);
    const oddballTwo = fileBuffer.lastIndexOf(CONSTANTS.HEX_ID);
    const tag = fileBuffer.slice(oddballOne + 8, oddballTwo);
    const decoded = decodeURIComponent(decryptText(tag).replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
    return decoded;
}

// addIDToFile();
// readIDFromFile();
module.exports = {
    addIDToFile,
    readIDFromFile,
}


















// const keys = crypto.randomBytes(8);
// const Securitykey = keys.toString('hex');

// // convert security key back to buffer
// const SecuritykeyBuffer = Buffer.from(Securitykey, 'hex');

// console.log('raw key buffer', keys);
// console.log('hex', Securitykey);
// console.log('back to buffer', SecuritykeyBuffer);


// const initVector = crypto.randomBytes(16).toString('hex');

// console.log(initVector);















// totally broken

// console.log(insertedText, endObjIndex);

// const startInsert = endObjIndex - insertedText.length;

// for (let i = 0; i < insertedText.length; i++) {
//     file[startInsert + i] = insertedText[i];
//     console.log(file[startInsert + i], insertedText[i])
// }

// console.log(file[startInsert + i]);
// console.log(endObjIndex, eofIndex);

// console.log(file[endObjIndex], file[endObjIndex + 1], file[endObjIndex + 2], file[endObjIndex + 3])