const express = require('express');
const router = express.Router();
const avisCtrl = require('../controllers/avis');

router.post('/ajout',avisCtrl.ajout);
router.get('/par_id/:id',avisCtrl.recevoirUnAvis);
router.get("/tousLesAvis/:filmId",avisCtrl.tousLesAvisDunFilm);

module.exports = router;