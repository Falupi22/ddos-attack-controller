const { Worker } = require("node:worker_threads");
const { v4: uuidv4 } = require('uuid');
const { log } = require("console");


class BackgroundPinger {
    constructor(url) {
        this.url = url;
        this.uuid = uuidv4();
        this.flag = false;
        this.workers = [];
    }
    startFew = async (pingCallback, times) => {
        for (let i = 0; i < times; i++) {
            this.start(pingCallback);
        }
    }

    start = async (pingCallback) => {
        const worker = new Worker('../agent/ping/pingWorker.js', {
            workerData: {
                url: this.url,
                uuid: this.uuid
            }
        });

        worker.on('message', async (val) => {
            await pingCallback(val)
        });

        worker.on('error', (err) => {
            console.error(`Worker encountered an error: ${err.message}`);
            this.worker.terminate();
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
            }
            console.error(`Worker stopped!`);
        });

        this.workers.push(worker);
        this.flag = true;
    }
    stop = () => {
        console.error(`Worker stop called`);
        this.flag = false;
        this.workers.forEach(worker => worker.terminate());
        this.workers.length = 0;
    }
}

module.exports = BackgroundPinger;