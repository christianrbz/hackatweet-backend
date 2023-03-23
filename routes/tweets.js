var express = require('express');
var router = express.Router();

require('../models/connection');
const Tweet = require('../models/tweets');


router.post('/', (req, res) => {
    // Vérifier que le texte du tweet ne dépasse pas 280 caractères
    if (req.body.text.length > 280) {
        return res.json({ message: "Le texte du tweet ne doit pas dépasser 280 caractères." });
    }

    // Créer un nouveau tweet avec les informations fournies dans la requête
    const tweet = new Tweet({
        text: req.body.text,
        hashtag: '#' + req.body.hashtag,
        like: 0,
        user: req.body.user // ID de l'utilisateur qui envoie le tweet
    });

    // Enregistrer le tweet dans la base de données
    tweet.save();
        res.json({ result: true, tweet: tweet });
    });
// });



module.exports = router;
