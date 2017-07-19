const express = require('express');
const router = express.Router();
var home = require(__base + 'controllers/home');

router.get('/', home.homePage);

module.exports = router;
