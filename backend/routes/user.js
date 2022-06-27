const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middlewares/authentification");

router.get("/par_id/:id", userCtrl.recuperation);
router.post("/inscription", userCtrl.inscription);
router.post("/connexion", userCtrl.connexion);
router.post("/likedFilm", auth, userCtrl.filmLiked);
router.post("/dislikedFilm", auth, userCtrl.filmDisliked);
router.post("/addNotice/:userId/:filmId", auth, userCtrl.addNotice);
router.post("/eraseNotice/:userId/:filmId", auth, userCtrl.eraseNotice);
// Uniquement utilisées pour le développement
router.get("/getLikedFilms/:id", userCtrl.getLikedFilms);
router.get("/getNoticedFilms/:id", userCtrl.getNoticedFilms);
router.get("/getDislikedFilms/:id", userCtrl.getDislikedFilms);

module.exports = router;