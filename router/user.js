const express = require("express");
const {
  registerUser,
  getSingleUser,
  getUserByEmail,
  allUser,
  handleDeleteUser,
} = require("../controler/userControler");


const router = express.Router();
router.post("/register", registerUser);
router.get("/singleByEmail/:email", getSingleUser);
router.get("/peruser", getUserByEmail);
router.get("/all", allUser);
router.delete("delete/:id/",handleDeleteUser);

module.exports = router;