'use strict';
const fs = require('fs');
const path = require('path');
const unzip = require('unzipper');
const { absolute } = require('../utils/path');
const { isEmpty } = require('../utils/validate');

module.exports = conf => {
    return new Promise((resolve, reject) => {
        let { name, src, dist = process.cwd() } = conf;
        if (isEmpty({ src })) {
            reject('The "conf" argument must be has property "src, name"');
            return;
        }
        name = name ? String(name) : path.basename(src.toLowerCase(), '.zip');
        dist = absolute(dist, name);
        fs.createReadStream(absolute(src)).pipe(unzip.Extract({ path: dist })).on('close', () => {
            resolve(Object.assign({ dist }, conf));
        }).on('error', err => {
            reject(err);
        });
    });
};