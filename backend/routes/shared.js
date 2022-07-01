const express = require("express");
const router = express.Router();
const sharedCtrl = require("../controllers/shared");
const auth = require("../middlewares/authentification");

router.post("/addOneOpinion", auth , sharedCtrl.addOneOpinion);
router.delete("/eraseOneOpinion/:opinionId", auth, sharedCtrl.eraseOneOpinion);

module.exports = router;