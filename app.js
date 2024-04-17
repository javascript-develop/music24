const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const fs = require("fs");
const VideoDB = require("./modal/videoModal");

const AWS = require("aws-sdk");
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
const cloudinary = require("./cloudinaryConfig");
const multer = require("multer");
const upload = multer();

app.use(
  cors({
    origin: "https://music-bf240.web.app",
  })
);
app.set("port", 5004);
app.use(express.json());
const errorHandeler = require("./utilitis/errorHandeler");
const userRouter = require("./router/user");
const orderRouter = require("./router/order");
const Music = require("./modal/musicModal");
const Subscription = require("./modal/SubscriptionModal");
const User = require("./modal/userModal");
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);
app.use(express.urlencoded({ extended: true }));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const s3 = new AWS.S3({
  accessKeyId: "AKIA47CRXO4GIXVWAKRI",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

app.post(
  "/addMusic",
  upload.fields([
    { name: "thumbnailFile", maxCount: 1 },
    { name: "musicFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title } = req.body;

      const thumbnailFile = req.files["thumbnailFile"][0];
      const musicFile = req.files["musicFile"][0];

      console.log(req.body, thumbnailFile, musicFile);

      const thumbnailData = thumbnailFile.buffer.toString("base64");

      const thumbnailResult = await cloudinary.uploader.upload(
        `data:${thumbnailFile.mimetype};base64,${thumbnailData}`,
        { folder: "folder" }
      );
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      });

      const musicParams = {
        Bucket: "musicupload21",
        Key: `audio/${musicFile.originalname}`, // Adjust the path as needed
        Body: musicFile.buffer,
      };

      const uploadMusicPromise = s3.upload(musicParams).promise();
      const musicUploadResponse = await uploadMusicPromise;
      console.log(
        uploadMusicPromise,
        thumbnailResult,
        "sddddddddddddddddddddddddd"
      );
      const newMusic = new Music({
        title,
        thumbnailPath: thumbnailResult.secure_url,
        musicFilePath: musicUploadResponse.Location,
      });

      // Save the new music document to MongoDB
      await newMusic.save();

      res
        .status(201)
        .json({ success: true, message: "Music added successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.post("/addvideo", upload.single("thumbnailFile"), async (req, res) => {
  try {
    const { title, youtubeLink } = req.body;
    const thumbnailFile = req.file;
    console.log(req.body, req.file);

    const thumbnailData = req.file.buffer.toString("base64");

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${thumbnailData}`,
      { folder: "folder" }
    );
    const newVideo = new VideoDB({
      title,
      youtubeLink,
      thumbnailFile: result.secure_url,
    });

    // Save the new video document to MongoDB
    await newVideo.save();

    // Respond with success message
    res
      .status(201)
      .json({ success: true, message: "Video added successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/create-subscription", async (req, res) => {
  const { planId, token, email, data } = req.body; // Assuming 'planId' is the ID of the selected subscription plan in Stripe
  console.log(req.body);
  try {
    let duration, price;

    // Determine the duration and price based on the selected planId
    switch (planId) {
      case "pro_karaoke_party":
        duration = 2; // 2 days
        price = 15; // $15
        break;
      case "pro_karaoke":
        duration = 30; // 15 days
        price = 28.41; // $50
        break;
      case "pro_karaoke_365":
        duration = 365; // 30 days
        price = 198; // $100
        break;
      default:
        // Handle invalid planId
        return res.status(400).json({ error: "Invalid planI" });
    }

    // const customer = await stripe.customers.create({
    //   source: token,
    //   email: email,

    // });

    // const subscription = await stripe.subscriptions.create({
    //   customer: customer.id,
    //   items: [{ plan: planId }],

    // });

    // Create payment with Stripe
    const charge = await stripe.charges.create({
      amount: price * 100,
      currency: "usd",
      description: `Payment for ${planId} membership`,
      source: token,
    });
    console.log(charge);
    const findUser = await User.findOne({ email: email });
    const newSubscription = new Subscription({
      userId: findUser._id, // Use Stripe's customer ID as the userId
      startDate: new Date(), // Start date of the subscription
      duration: data.duration, // Duration of the subscription in days
      price: data.price, // Price of the subscription
    });

    // Save the new subscription document to the database
    await newSubscription.save();

    // Update the user document in MongoDB with subscription details
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      {
        plan: planId, // Update the user's plan
        subscriptionStartDate: new Date(),
        subscriptionDuration: duration,
        subscriptionStatus: "active", // Set the subscription status to "active"
      },
      { new: true } // Return the updated user document
    );

    res.status(200).json({
      success: true,
      message: "Subscription created successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    console.log(id)
    const deletedUser = await User.findByIdAndDelete(id);
    console.log('Deleted user:', deletedUser);
    if (deletedUser) {
      res.json({ success: true, message: 'User deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    // If an error occurs during deletion, send error response
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.use("/", (req, res) => {
  res.send("hellw world");
});

app.use(errorHandeler);

module.exports = app;
