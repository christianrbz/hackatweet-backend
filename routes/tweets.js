var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const Tweet = require('../models/tweets');


router.post('/', (req, res) => {
    // Check that the text of the tweet does not exceed 280 characters
    if (!checkBody(req.body, ['text', 'hashtag', 'user'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }
    if (req.body.text.length > 280) {
        return res.json({ error: "The text of the tweet must not exceed 280 characters." });
    }

    // Create a new tweet with the information provided in the request
    const tweet = new Tweet({
        text: req.body.text,
        hashtag: '#' + req.body.hashtag,
        like: 0,
        user: req.body.user // ID of the user sending the tweet
    });
    // Save the tweet in the database
    tweet.save();
    res.json({ result: true, tweet: tweet });
});




router.delete('/:id', (req, res) => {
    Tweet.deleteOne({
        _id: req.params.id
    }).then(deletedDoc => {
        if (deletedDoc.deletedCount > 0) {
            // document successfully deleted
            Tweet.find().then(data => {
                res.json({ result: true, tweet: data });
            });
        } else {
            res.json({ result: false, error: "Tweet not found" });
        }
    });
});

router.get('/', (req, res) => {
    Tweet.find().then(data => {
        res.json({ tweets: data });
    });
});

router.get("/:hashtag", (req, res) => {
    Tweet.find({
        hashtag: "#" + req.params.hashtag,
    }).then(data => {
        if (data) {
            res.json({ result: true, tweets: data });
        } else {
            res.json({ result: false, error: "Hashtag not found" });
        }
    });
});

module.exports = router;
