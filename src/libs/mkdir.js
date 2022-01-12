'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const { absolute } = require('../utils/path');

module.exports = (dir, options = { recursive: true }) => new Promise((resolve, reject) => {
    dir = absolute(dir);
    if (fs.existsSync(dir)) {
        resolve({ ok: 1 });
        return;
    }
    mkdirp(dir, options).then(() => resolve({ ok: 1 })).catch(e => reject(e));
});
