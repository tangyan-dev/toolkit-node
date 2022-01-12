'use strict';

const fs = require('fs');
const crypto = require('crypto');
const { absolute } = require('../utils/path');

module.exports = (input, len) => {
    let hash = crypto.createHash('md5');
    let file = absolute(input);
    let type = 'string';
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        type = 'file';
        let fd = fs.openSync(file, 'r');
        try {
            const BUFFER_SIZE = 8192;
            let buffer = Buffer.alloc(BUFFER_SIZE);
            let bytesRead;
            do {
                bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE);
                hash.update(buffer.slice(0, bytesRead));
            } while (bytesRead === BUFFER_SIZE);
        } finally {
            fs.closeSync(fd);
        }
    } else {
        hash.update(Buffer.from(input));
    }
    return {
        type,
        md5: hash.digest('hex').slice(0, Number(len) || undefined)
    };
};
