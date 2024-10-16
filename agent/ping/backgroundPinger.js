const { exec } = require('child_process');
const { PingMessages } = require('../models');

class BackgroundPinger {
    constructor(ip) {
        this.ip = ip;
        this.flag = false;
    }
    start = async (times) => {
        this.flag = true;
        for (let iter = 0; iter < times && this.flag; iter++) {
            try {
                // Spawn the process and detach it from the parent process
                const child = exec(`ping ${this.ip}`, {
                    detached: true,
                    stdio: 'ignore'
                });

                child.stdout.on('data', (data) => {
                    if (data.includes('Request timed out')) {
                        console.log(PingMessages.REQUEST_TIMEOUT);
                    } else if (data.includes('Destination host unreachable')) {
                        console.log(PingMessages.DESTINATION_UNREACHABLE);
                    } else if (data.includes('Network unreachable')) {
                        console.log(PingMessages.NETWORK_UNREACHABLE);
                    } else if (data.includes('transmit failed. General failure')) {
                        console.log(PingMessages.GENERAL_FAILURE);
                    } else {
                        console.log(PingMessages.SUCCESS);
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Unreference the child process so it runs independently in the background
                child.unref();
            }
            catch (error) {
                console.error(`Error occurred while pinging ${this.ip}: ${error}`);
                return PingMessages.UNKNOWN_ERROR;
            }
        }
    }
    stop = () => {
        this.flag = false;
    }
}

module.exports = BackgroundPinger;