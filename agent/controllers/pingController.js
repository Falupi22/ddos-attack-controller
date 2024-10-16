const BackgroundPinger = require("../ping/backgroundPinger");
const asyncHandler = require("express-async-handler");

const pingPool = [];

function startPing(req, res) {
    console.log("Starting ping " + JSON.stringify(req.body))
    const ip = req.body.ip;
    const pinger = new BackgroundPinger(ip);
    pingPool.push(pinger)
    pinger.start(10);

    res.status(201).json({ message: "Ping started", });
};

function stopPing(req, res) {
    console.log("Stopping ping for` " + req.params.ip)
    console.log(pingPool)
    const ip = req.params.ip;
    console.log(ip)

    const pinger = pingPool.find(p => p.ip === ip);

    console.log(pinger)
    console.log("test")

    if (pinger) {
        pinger.stop();
        pingPool.length = 0;
        pingPool.push(...pingPool.filter(item => item.ip !== ip));
        res.status(200).json({ message: "Ping stopped", });
        return;
    }

    res.status(400).json({ message: "Error", });

};


module.exports = { startPing, stopPing };