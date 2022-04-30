const express = require('express');
const router = express.Router();
const filmCtrl = require('../controllers/film');
const multer = require('../middlewares/multer-config');

router.get('/', filmCtrl.tousLesFilms);
router.get('/:id', filmCtrl.unFilm);
router.post('/', multer, filmCtrl.ajouter);
router.delete('/:id',filmCtrl.supprimer);

module.exports = router;