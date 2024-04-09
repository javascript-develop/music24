const express = require("express");
const {
  registerUser,
  getSingleUser,
  getUserByEmail,
} = require("../controler/userControler");


const router = express.Router();
router.post("/register", registerUser);
router.get("/singleByEmail/:email", getSingleUser);
router.get("/peruser", getUserByEmail);

module.exports = router;