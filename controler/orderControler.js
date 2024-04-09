const fs = require("fs");
const MusicDB = require("../modal/musicModal");
const VideoDB = require("../modal/videoModal");
const Music = require("../modal/musicModal");
const User = require("../modal/userModal");

// Handler function to add music
exports.addMusicHandler = async (req, res) => {
  try {
    const { title } = req.body;
    const thumbnailPath = req.file.path; // Path to the uploaded thumbnail image
    const musicFilePath = req.file.path; // Path to the uploaded music file

    // Create a new music document
    const newMusic = new MusicDB({
      title,
      thumbnailPath,
      musicFilePath,
    });

    // Save the music document to the database
    await newMusic.save();

    // Optionally, you can delete the uploaded files after processing
    fs.unlinkSync(thumbnailPath);
    fs.unlinkSync(musicFilePath);

    res.status(200).json({ message: "Music added successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllVideo = async (req, res) => {
  try {
    // Query database to retrieve all video data
    const videos = await VideoDB.find();

    // Send the retrieved video data as JSON response
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAllAudio = async (req, res) => {
  try {
    // Query database to retrieve all video data
    const audio = await Music.find({});

    // Send the retrieved video data as JSON response
    res.status(200).json(audio);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getSingleAudio = async (req, res) => {
  try {
    const id = req.params.id;
    const audio = await Music.findById(id);

    // Send the retrieved video data as JSON response
    res.status(200).json(audio);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAudio = async (req, res) => {
  const userEmail = req.query.email;
  console.log(userEmail);
  try {
    // Find the user in MongoDB
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user has an active subscription
    const currentDate = new Date();
    const subscriptionExpiryDate = new Date(user.subscriptionStartDate);
    subscriptionExpiryDate.setDate(subscriptionExpiryDate.getDate() + 3);

    if (currentDate <= subscriptionExpiryDate) {
      return res.status(200).json({ message: "Access granted to music" });
    } else {
      return res.status(403).json({
        error:
          "Subscription expired. Please renew your subscription to access music.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
