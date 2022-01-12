module.exports = () => {
    const interfaces = require('os').networkInterfaces();
    const address = [];
    Object.keys(interfaces).forEach(key => {
        interfaces[key].forEach(item => {
            item.family === 'IPv4' && !item.internal && address.push(item.address);
        });
    });
    return address;
};
