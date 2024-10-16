const os = require('os');

let ip;

const getIP = () => {
    return ip ?? getLocalIp();
}

function getLocalIp() {
    const networkInterfaces = os.networkInterfaces();

    for (const interfaceName in networkInterfaces) {
        const addresses = networkInterfaces[interfaceName];

        for (const address of addresses) {
            if (address.family === 'IPv4' && !address.internal) {
                ip = address.address;
                return ip;
            }
        }
    }

    return 'No local IP found';
}

module.exports = getIP;