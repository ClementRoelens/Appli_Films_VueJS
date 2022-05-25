const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require("../middlewares/authentification");

router.post('/inscription', userCtrl.inscription);
router.post('/connexion', userCtrl.connexion);
router.post('/likedFilm', auth, userCtrl.filmLiked);
router.post('/dislikedFilm', auth, userCtrl.filmDisliked);

module.exports = router;