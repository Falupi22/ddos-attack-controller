const BackgroundPinger = require("../ping/backgroundPinger");
const { Worker } = require("node:worker_threads");
const { sendMessage } = require("../amqp");

const pingPool = [];

function startPing(req, res) {
    try {
        const url = req.body.url;
        const pinger = new BackgroundPinger(url);
        pingPool.push(pinger);

        for (let i = 0; i < 5; i++) {
            pinger.start(sendMessage);
        }
        console.log("Ping started")
        res.status(201).json({ uuid: pinger.uuid });

    } catch (err) {
        console.error({ error: err });

        res.status(500).json({ error: err });
    }
};

function stopPing(req, res) {
    const uuid = req.params.uuid;
    const pinger = pingPool.find(p => p.uuid === uuid);

    if (pinger) {
        pinger.stop();
        pingPool.length = 0;
        pingPool.push(...pingPool.filter(item => item.uuid !== uuid));
        res.status(200).json({ message: "Ping stopped", });
        return;
    }

    res.status(400).json({ message: "Error", });
};


module.exports = { startPing, stopPing };