const express = require('express');
const router = express.Router();
const home = require(__base + 'controllers/home');
const oauth = require(__base + 'controllers/oauth');

router.get('/token', oauth.fetchToken, oauth.fetUserDetails, oauth.createGoldengateSession);

router.get('/*', home.homePage);

module.exports = router;
