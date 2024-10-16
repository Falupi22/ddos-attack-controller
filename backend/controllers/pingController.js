

function startPing(req, res) {
    fetch(`http://${req.body.ip}:5555/ping/start`, {
        method: 'POST', body: {
            ip: req.body.targetIP
        }
    }).then((val) => { res.status(201).json({ message: "Ping started", }); }).catch(err => {
        console.error(err);
        res.status(500).json({ message: err, });
        return;
    })
};

function stopPing(req, res) {
    fetch(`http://${req.body.ip}:5555/${req.body.targetIP}`, {
        method: 'DELETE'
    }).catch(err => {
        console.error(err);
        res.status(500).json({ message: err, });
        return;
    }).then(() => { res.status(200).json({ message: "Ping stopped", }); });
};


module.exports = { startPing, stopPing };