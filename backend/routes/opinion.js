const express = require("express");
const router = express.Router();
const opinionCtrl = require("../controllers/opinion");

router.post("/addOneOpinion",opinionCtrl.addOneOpinion);
router.get("/getOneOpinion/:id",opinionCtrl.getOneOpinion);
router.get("/getAllOpinionsInOneFilm/:filmId",opinionCtrl.getAllOpinionsInOneFilm);

module.exports = router;