const mongoose = require("mongoose");

// Define the music schema
const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true
  },
  thumbnailPath: {
    type: String,
    // required: true
  },
  musicFilePath: {
    type: String,
    // required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model using the schema
const Music = mongoose.model("Music", musicSchema);

module.exports = Music;
