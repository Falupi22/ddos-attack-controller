const { Worker } = require("node:worker_threads");
const { v4: uuidv4 } = require('uuid');
const { log } = require("console");


class BackgroundPinger {
    constructor(url) {
        this.url = url;
        this.uuid = uuidv4();
        this.flag = false;
        this.worker = null;
    }
    start = async (pingCallback) => {
        this.worker = new Worker('../agent/ping/pingWorker.js', {
            workerData: {
                url: this.url,
                uuid: this.uuid
            }
        });

        this.worker.on('message', async (val) => {
            await pingCallback(val)
        });

        this.worker.on('error', (err) => {
            console.error(`Worker encountered an error: ${err.message}`);
            this.worker.terminate();
        });

        this.worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
            }
        });

        this.worker
    }
    stop = () => {
        this.flag = false;
        this.worker.terminate();
    }
}

module.exports = BackgroundPinger;