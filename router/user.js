const express = require("express");
const {
  registerUser,
  getSingleUser,
  getUserByEmail,
  allUser,
} = require("../controler/userControler");


const router = express.Router();
router.post("/register", registerUser);
router.get("/singleByEmail/:email", getSingleUser);
router.get("/peruser", getUserByEmail);
router.get("/all", allUser);

module.exports = router;