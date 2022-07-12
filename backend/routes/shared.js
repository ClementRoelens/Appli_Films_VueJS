const express = require("express");
const router = express.Router();
const sharedCtrl = require("../controllers/shared");
const auth = require("../middlewares/authentification");

router.post("/addOneOpinion", auth , sharedCtrl.addOneOpinion);
router.put("/likeOpinion",auth,sharedCtrl.likeOpinion);
router.put("/likeFilm",auth,sharedCtrl.likeFilm);
router.put("/dislikeFilm",auth,sharedCtrl.dislikeFilm);
router.delete("/eraseOneOpinion/:opinionId", auth, sharedCtrl.eraseOneOpinion);

module.exports = router;