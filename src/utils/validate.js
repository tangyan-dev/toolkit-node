module.exports = {
    isEmpty: obj => Object.keys(obj).some(key => obj[key] === 'undefined')
};