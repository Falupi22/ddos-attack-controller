

async function startPing(req, res) {
    try {
        const response = await fetch(`http://${req.body.ip}:5555/ping/start`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ url: req.body.url })
        });

        if (!response.ok) {
            const json = await response.json();
            console.error(`Error while fetching test: ${response.status} ${JSON.stringify(json)}`);
            res.status(response.status).json({ message: "Failed to start ping", });
            return;
        }
        const json = await response.json();
        res.status(201).json(json);
    }
    catch (err) {
        console.error(`Error while fetching: ${err} `);

        res.status(500).json({ message: err, });
        return;
    }
};

function stopPing(req, res) {
    fetch(`http://${req.params.ip}:5555/ping/stop/${req.params.uuid}`, {
        method: 'DELETE'
    }).catch(err => {
        console.error(err);
        res.status(500).json({ message: err, });
        return;
    }).then((v) => {
        console.log(v.status);
        res.status(200).json({ message: "Ping stopped", });
    });
};


module.exports = { startPing, stopPing };