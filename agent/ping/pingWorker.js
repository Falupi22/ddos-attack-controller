const { parentPort, workerData } = require('worker_threads');
const { PingMessages } = require('../models');
const { exec } = require('child_process');
const { getIP } = require("../utils");
const { log } = require("console");

const url = workerData.url;
const times = workerData.times;
const uuid = workerData.uuid;

try {
    let lastMessage = PingMessages.PENDING;
    for (let iter = 0; iter < times; iter++) {
        try {
            // Spawn the process and detach it from the parent process
            const child = exec(`ping ${url}`, {
                detached: true,
                stdio: 'ignore'
            });

            child.stdout.on('data', async (data) => {
                log('data: ', data);
                let message;
                if (data.includes('Request timed out')) {
                    message = PingMessages.REQUEST_TIMEOUT;
                } else if (data.includes('Destination host unreachable')) {
                    message = PingMessages.DESTINATION_UNREACHABLE;
                } else if (data.includes('Network unreachable')) {
                    message = PingMessages.NETWORK_UNREACHABLE;
                } else if (data.includes('transmit failed. General failure')) {
                    message = PingMessages.GENERAL_FAILURE;
                } else if (data.includes('Ping request could not find host')) {
                    message = PingMessages.HOST_NOT_FOUND;
                } else if (data.startsWith('Pinging')) {
                    message = PingMessages.PENDING;
                }
                else if (data.startsWith('Reply')) {
                    message = PingMessages.SUCCESS;
                }
                else {
                    // No meaning to the output
                    message = lastMessage;
                }

                lastMessage = message;

                parentPort.postMessage({
                    ip: getIP(),
                    url,
                    uuid,
                    message
                });

                await new Promise(resolve => setTimeout(resolve, 1000));
            });

            // Unreference the child process so it runs independently in the background
            child.unref();
        }
        catch (error) {
            console.error(`Error occurred while pinging ${url}: ${error}`);
            this.flag = false;
            throw error;
        }
    }
}
catch (err) {
    console.error(`Error in worker thread: ${err.message}`);
    throw err;
}