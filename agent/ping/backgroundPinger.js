const { exec } = require('child_process');
const { PingMessages } = require('../models');
const { getIP } = require("../utils");

class BackgroundPinger {
    constructor(ip) {
        this.ip = ip;
        this.flag = false;
    }
    start = async (times, pingCallback) => {
        this.flag = true;
        for (let iter = 0; iter < times && this.flag; iter++) {
            try {
                // Spawn the process and detach it from the parent process
                const child = exec(`ping ${this.ip}`, {
                    detached: true,
                    stdio: 'ignore'
                });

                child.stdout.on('data', async (data) => {
                    let message;
                    if (data.includes('Request timed out')) {
                        message = PingMessages.REQUEST_TIMEOUT;
                    } else if (data.includes('Destination host unreachable')) {
                        message = PingMessages.DESTINATION_UNREACHABLE;
                    } else if (data.includes('Network unreachable')) {
                        message = PingMessages.NETWORK_UNREACHABLE;
                    } else if (data.includes('transmit failed. General failure')) {
                        message = PingMessages.GENERAL_FAILURE;
                    } else {
                        message = PingMessages.SUCCESS;
                    }

                    await pingCallback({
                        ip: getIP(),
                        targetIP: this.ip,
                        message
                    });

                    await new Promise(resolve => setTimeout(resolve, 1000));
                });

                // Unreference the child process so it runs independently in the background
                child.unref();
            }
            catch (error) {
                console.error(`Error occurred while pinging ${this.ip}: ${error}`);
                this.flag = false;
            }
        }
    }
    stop = () => {
        this.flag = false;
    }
}

module.exports = BackgroundPinger;