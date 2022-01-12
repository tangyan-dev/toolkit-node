'use strict';

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const mkdir = require('./mkdir');
const md5 = require('./md5');
const { absolute } = require('../utils/path');
const { isEmpty } = require('../utils/validate');
const { to, dateTool, isString, isObject } = require('@tangyansoft/toolkit-common');

module.exports = conf => {
    return new Promise(async (resolve, reject) => {
        let { name, src, dist = process.cwd(), dateFormat = 'yyyyMMdd', glob } = conf;
        if (isEmpty({ name, src })) {
            reject('Please check the settings (name, src) in argument');
            return;
        }
        dist = absolute(dist);
        src = absolute(src);
        let [err, status] = await to(mkdir(dist));
        if (err) {
            return reject(err);
        }
        if (!fs.existsSync(src)) {
            return reject(new Error(`${src} not exists`));
        }
        let zipUrl = absolute(path.resolve(dist, `${name}${dateFormat && isString(dateFormat) ? `-${dateTool.format(Date.now(), dateFormat)}` : ''}.zip`));
        let output = fs.createWriteStream(zipUrl);
        let zip = archiver('zip', { zlib: { level: 9 } });
        output.on('close', err => {
            err ? reject(err) : resolve(Object.assign({ zipUrl, dist, md5: md5(zipUrl).md5 }, conf));
        });
        zip.on('warning', err => { err.code !== 'ENOENT' && console.warn(err); });
        zip.on('error', err => { reject(err); });
        zip.pipe(output);
        if (isObject(glob)) {
            let { pattern, options = {} } = glob;
            if (!isString(pattern)) {
                return reject(new Error('pattern must be a string'));
            }
            zip.glob(pattern, Object.assign({ cwd: src }, options));
        } else {
            fs.statSync(src).isDirectory() ? zip.directory(src, '/') : zip.file(src, { name: path.basename(src) });
        }
        zip.finalize();
    });
};
