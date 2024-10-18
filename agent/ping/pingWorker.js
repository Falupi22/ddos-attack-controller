const { parentPort, workerData } = require('worker_threads');
const { PingMessages } = require('../models');
const { exec } = require('child_process');
const { getIP } = require("../utils");
const { log } = require("console");

const url = workerData.url;
const uuid = workerData.uuid;

try {
    let lastMessage = PingMessages.NO_INFO;
    try {
        // Spawn the process and detach it from the parent process
        const child = exec(`ping ${url} -t -l 1000`, {
            detached: true,
            stdio: 'ignore'
        });

        child.stdout.on('data', async (data) => {
            let message;
            data = data.split('\n')            // Split the string by line breaks
                .filter(line => line.trim() !== '')  // Filter out empty lines (trimmed lines)
                .join();

            const timestamp = new Date(Date.now()).getTime();
            if (data.includes('Request timed out')) {
                message = PingMessages.REQUEST_TIMEOUT;
                parentPort.postMessage({
                    ip: getIP(),
                    url,
                    uuid,
                    message,
                    timestamp
                });
            } else if (data.includes('Destination host unreachable')) {
                message = PingMessages.DESTINATION_UNREACHABLE;
                parentPort.postMessage({
                    ip: getIP(),
                    url,
                    uuid,
                    message,
                    timestamp
                });
            } else if (data.includes('Network unreachable')) {
                message = PingMessages.NETWORK_UNREACHABLE;
                parentPort.postMessage({
                    ip: getIP(),
                    url,
                    uuid,
                    message,
                    timestamp
                });
            } else if (data.includes('transmit failed. General failure')) {
                message = PingMessages.GENERAL_FAILURE;
                parentPort.postMessage({
                    ip: getIP(),
                    url,
                    uuid,
                    message,
                    timestamp
                });
            } else if (data.includes('Ping request could not find host')) {
                message = PingMessages.HOST_NOT_FOUND;
                parentPort.postMessage({
                    ip: getIP(),
                    url,
                    uuid,
                    message,
                    timestamp
                });
            } else if (data.startsWith('Pinging')) {
                console.log('Pinging')
                message = PingMessages.PENDING;
                parentPort.postMessage({
                    ip: getIP(),
                    url,
                    uuid,
                    message,
                    timestamp
                });
            }
            else if (data.startsWith('Reply')) {
                message = PingMessages.SUCCESS;
                parentPort.postMessage({
                    ip: getIP(),
                    url,
                    uuid,
                    message,
                    timestamp
                });
            }
            else {
                // No meaning to the output
                message = lastMessage;
                log(data)
            }

            lastMessage = message;

            await new Promise(resolve => setTimeout(resolve, 100));

        });
    }
    catch (error) {
        console.error(`Error occurred while pinging ${url}: ${error}`);
        this.flag = false;
        throw error;
    }
}
catch (err) {
    console.error(`Error in worker thread: ${err.message}`);
    throw err;
}