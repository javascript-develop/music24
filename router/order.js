const express = require("express");
const {
  addMusicHandler,
  getAllVideo,
  getAllAudio,
  getSingleAudio,
  getAudio,
  deleteVideo
} = require("../controler/orderControler");

const router = express.Router();
router.post("/addMusic", addMusicHandler);
router.get("/getallvideo", getAllVideo);
router.get("/getallaudio", getAllAudio);
router.get("/music/:id", getSingleAudio);
router.get("/music/", getAudio);
router.delete("/deletevideo/:id", deleteVideo);

module.exports = router;
