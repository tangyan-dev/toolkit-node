'use strict';
const path = require('path');
const slash = require('slash');

module.exports = {
    absolute: (...arg) => {
        let _path = slash(path.resolve.apply(null, arg));
        if (path.isAbsolute(_path)) {
            return _path;
        }
        arg.unshift(process.cwd());
        return slash(path.resolve.apply(null, arg));
    }
};
