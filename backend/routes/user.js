const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/inscription',userCtrl.inscription);
router.post('/connexion',userCtrl.connexion);

module.exports = router;