'use strict';

const { spawn } = require('child_process');
module.exports = (script, args, options = {}) =>
    new Promise((resolve, reject) => {
        const command = spawn(
            script,
            args,
            Object.assign(
                {
                    cwd: process.cwd(),
                    stdio: 'inherit',
                    shell: true,
                },
                options
            )
        );
        command.on('close', code => {
            resolve(code);
        });
        command.on('error', error => {
            reject(error);
        });
    });