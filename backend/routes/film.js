const express = require('express');
const router = express.Router();
const filmCtrl = require('../controllers/film');
const validator = require("../middlewares/validateFilm");
const multer = require('../middlewares/multer-config');
const auth = require("../middlewares/authentification");

// Les get
// Renvoie la totalité
router.get('/', filmCtrl.tousLesFilms);
router.get('/par_genre/:genre', filmCtrl.tousLesFilmsParGenre);
router.get('/par_real/:real', filmCtrl.tousLesFilmsParReal);
// Renvoie un certain nombre au hasard
router.get('/au_hasard', filmCtrl.filmsAuHasard);
router.get('/au_hasard_par_genre/:genre',filmCtrl.filmsAuHasardParGenre);
router.get('/au_hasard_par_real/:real',filmCtrl.filmsAuHasardParReal);
router.get('/un_seul_au_hasard', filmCtrl.unFilmAuHasard);
// Renvoie un seul film choisi
router.get('/par_id/:id', filmCtrl.unFilm);

// Les autres
// Il serait bien plus logique de d'abord valider, et d'ensuite si la requête est bonne d'ajouter l'image... Mais je n'ai pas encore trouvé comment
router.post('/ajout', multer, filmCtrl.ajouterFilm);
router.post('/like/:id', auth, filmCtrl.like);
router.post('/dislike/:id', auth , filmCtrl.dislike);
router.post('/addNotice/:filmId/:noticeId', auth, filmCtrl.ajouterAvis);

router.put('/:filmId/:avisId', filmCtrl.modifierFilm);

// router.delete('/:id',filmCtrl.supprimer);
module.exports = router;