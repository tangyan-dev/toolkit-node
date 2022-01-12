'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { to, isArray } = require('@tangyansoft/toolkit-common');
const { absolute } = require('../utils/path');

module.exports = {
  write: (file, content, options = {}) => {
    const { type, backupSuffix, encoding = 'utf8' } = options;
    const mkdir = dir => mkdirp(dir);
    return new Promise(async (resolve, reject) => {
      const [err] = await to(mkdir(path.dirname(file)));
      if (err) {
        reject(err);
        return;
      }
      try {
        if (backupSuffix && fs.existsSync(file)) {
          let basename = path.basename(file);
          if (/^\./.test(basename)) {
            basename += `_${backupSuffix}`;
          } else {
            basename = basename.replace(/\.\w+$/, $1 => `_${backupSuffix}${$1}`);
          }
          let backupFile = path.join(path.dirname(file), basename);
          let backupContent = await this.read(file, { encoding });
          backupContent !== content && fs.writeFileSync(backupFile, backupContent);
          if (backupContent === content) {
            return resolve({ ok: 1 });
          }
        }
        fs[type === 'append' ? 'appendFileSync' : 'writeFileSync'](file, content, encoding);
        resolve({ ok: 1 });
      } catch (err) {
        reject(err);
      }
    });
  },
  read: (file, options = { encoding: 'utf8' }) => {
    const { encoding } = options;
    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(file)) {
          return resolve(fs.readFileSync(file, encoding));
        } else {
          throw new Error(`${file} not exist!`)
        }
      } catch (err) {
        reject({
          status: 'error',
          content: ''
        });
      }
    });
  },
  size: file => {
    if (fs.existsSync(file)) {
      try {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const bytes = fs.statSync(file).size;
        if (bytes === 0) {
          return {
            size: 0,
            unit: 'Bytes'
          };
        }
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1000)));
        return {
          size: parseFloat((bytes / Math.pow(1000, i)).toFixed(1)),
          unit: sizes[i]
        };
      } catch (error) {

      }
    }
    return {
      size: 0,
      unit: 'Bytes'
    };
  },
  getFiles: (dir, exclude = [], advance = () => true) => {
    const files = [];
    const getFiles = dir => {
      if (fs.statSync(dir).isDirectory()) {
        fs.readdirSync(dir).forEach(p => {
          let file = path.join(dir, p);
          if (fs.statSync(file).isDirectory()) {
            getFiles(file);
            return;
          }
          if (!advance(file)) {
            return;
          }
          if (isArray(exclude) && exclude.length && exclude.some(item => new RegExp(`${item}$`).test(file))) {
            return;
          }
          files.push(file);
        });
      }
    };
    getFiles(absolute(dir));
    return files;
  }
};
