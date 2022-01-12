const test = require('@tangyansoft/toolkit-node');


test.zip({
    name: 'test',
    src: './example',
    glob: {
        pattern: '**/**',
        options: {
            ignore: ['**/node_modules/**', '**/index.js']
        }
    }
}).then(({ zipUrl }) => {
    console.log(zipUrl);
    test.unzip({
        src: zipUrl
    }).then(({ dist }) => {
        console.log(dist)
    }).catch(e => {
        console.log(e)
    })
})