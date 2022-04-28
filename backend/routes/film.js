const express = require('express');
const router = express.Router();
const filmCtrl = require ('../controllers/film');
const multer = require('../middlewares/multer-config.js');

router.get('/',filmCtrl.tousLesFilms);
router.get('/:id',filmCtrl.unFilm);
router.post('/ajout',multer,filmCtrl.ajouterUnFilm);

module.exports = router;