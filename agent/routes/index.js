var express = require('express');
const { startPing } = require("../controllers/pingController");
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  console.log('check!');
  res.status(200).json()
});

module.exports = router;
