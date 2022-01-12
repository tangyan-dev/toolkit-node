'use strict';

const fs = require('fs');
const dirCompare = require('dir-compare');
const fileCompare = require('file-compare');
const { absolute } = require('../utils/path');

module.exports = (left, right) => {
    left = absolute(left);
    right = absolute(right);
    if ([left, right].map(item => fs.statSync(item).isFile()).every(item => item)) {
        return new Promise((resolve, reject) => {
            fileCompare.compare(left, right, (res, err) => {
                if (err) {
                    return reject(err);
                }
                resolve({ isEqual: res, differences: [] });
            });
        });
    }
    return dirCompare.compare(left, right, { compareContent: true }).then(res => {
        return {
            isEqual: !res.diffSet.some(item => item.state !== 'equal'),
            differences: res.diffSet.filter(item => item.state !== 'equal').map(item => ({ left: item.path1, right: item.path2 }))
        };
    });
};
