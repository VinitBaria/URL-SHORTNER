const shortId = require('shortid');
const Item = require('../models/url');



async function generateShortUrl(req, res) {
    const body = req.body;
    if (!body) return res.status(400).send({ message: "Body is missing" });
    const shorurl = shortId();
    await Item.create({
        shortId: shorurl,
        orgurl: body.orgurl,
        createdby: req.user._id,
    }); 
    return res.redirect('/');
}

async function getAllUrls(req, res) {
    const allurl = await Item.find({createdby: req.user._id}); 
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8001}`;
    const array = allurl.map(item => ({
        orgurl: item.orgurl,
        shortId: `${baseUrl}/${item.shortId}`
    })); 
    res.render('index', { array });
}


async function redirectToOriginalUrl(req, res) {
    const shortId = req.params.shortId;
    await Item.findOneAndUpdate(
        { shortId },
        { $push: { visitedhistory: Date.now() } },          
        { new: true }
    );
    const item = await Item.findOne({ shortId });
    if (!item) return res.status(404).send({ message: "Short URL not found" });
    return res.redirect(item.orgurl);
}  


async function getUrlStats(req, res) {
    const shortId = req.params.shortId;
    const entry = await Item.findOne({ shortId });
    if (!entry) return res.status(404).send({ message: "Short URL not found" });
    const totalClicks = entry.visitedhistory.length;
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8001}`;
    return res.status(200).json({
        orgurl: entry.orgurl,
        shortId: `${baseUrl}/${entry.shortId}`,
        totalClicks,
        visitedhistory: entry.visitedhistory,
    });
}

async function admidviewroute(req,res){
    console.log("Admin route accessed");
    const allurl = await Item.find({}); 
    console.log(allurl);
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8001}`;
    const array = allurl.map(item => ({
        orgurl: item.orgurl,
        shortId: `${baseUrl}/${item.shortId}`,
        createdby: item.createdby,
    })); 
    res.render('index', { array });
}
module.exports = {
    generateShortUrl,
    redirectToOriginalUrl,
    getUrlStats,
    getAllUrls,
    admidviewroute
};