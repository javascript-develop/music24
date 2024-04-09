const mongoose = require('mongoose');

// Define the music schema
const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  thumbnailFile: {
    type: String,
    required: true
  },
  youtubeLink: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model using the schema
const Video = mongoose.model('Video', VideoSchema);

module.exports = Video;
