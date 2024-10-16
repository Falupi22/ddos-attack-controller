var express = require('express');
const { startPing } = require("../controllers");
const { stopPing } = require("../controllers");
var router = express.Router();

router.post('/start', startPing);
router.delete('/stop/:ip', stopPing);

module.exports = router;
