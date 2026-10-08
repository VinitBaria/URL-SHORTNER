const express = require('express');
const route =express.Router();
const shortId = require('shortid');
const {authenticateUser,restrictToRoles}=require('../middleware/auth');

const { generateShortUrl,
        redirectToOriginalUrl,
        getUrlStats,
        getAllUrls,
        admidviewroute              }=require('../controller/url');

route.get('/admin',restrictToRoles(["Admin"]),admidviewroute);

route.post('/',generateShortUrl);

route.get('/',getAllUrls);

route.get('/:shortId', redirectToOriginalUrl);

route.get('/:shortId/stats', getUrlStats);

module.exports = route;
