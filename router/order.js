const express = require("express");
const {
  addMusicHandler,
  getAllVideo,
  getAllAudio,
  getSingleAudio,
  getAudio,
} = require("../controler/orderControler");

const router = express.Router();
router.post("/addMusic", addMusicHandler);
router.get("/getallvideo", getAllVideo);
router.get("/getallaudio", getAllAudio);
router.get("/music/:id", getSingleAudio);
router.get("/music/", getAudio);

module.exports = router;
