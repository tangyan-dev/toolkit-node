
'use strict';

const rm = require('rimraf');
const { absolute } = require('../utils/path');
const { isString } = require('@tangyansoft/toolkit-common');

module.exports = (path, options = {}) => {
    return new Promise((resolve, reject) => {
        if (!isString(path)) {
            reject('The "path" argument must be a string');
            return;
        }
        rm(absolute(path), options, (err) => {
            err ? reject(err) : resolve({ ok: 1 });
        });
    });
};
