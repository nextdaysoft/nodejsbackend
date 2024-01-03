const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../model/userModel");
const Otp = require("../model/otpModel");
const Request = require("../model/requestModel");
const Collector = require("../model/collectorModel");
const Test = require("../model/testModel");
const admin = require("firebase-admin");
const multer = require("multer");

const signupUserController = async (req, res) => {
  try {
    const { number, fcmToken } = req.body;
    if (!number || !fcmToken) {
      return res.status(400).send("Number and FCM token are required.");
    }

    const userExists = await User.findOne({ number });
    if (userExists) {
      return res.status(400).send("User already registered!");
    }

    function generateNumericOTP() {
      const OTP_LENGTH = 6;
      let OTP = "";
      for (let i = 0; i < OTP_LENGTH; i++) {
        OTP += Math.floor(Math.random() * 10); // Generates a random digit (0-9) and appends it to OTP
      }
      return OTP;
    }
    const generatedOTP = generateNumericOTP();
    const hashedOTP = await bcrypt.hash(generatedOTP, 10);

    const otp = new Otp({ number, otp: hashedOTP });
    const savedOTP = await otp.save();
    const OTP = generateNumericOTP();
    const message = {
      data: {
        title: "Verification OTP",
        body: generatedOTP,
      },
      token: fcmToken,
    };

    const response = await admin.messaging().send(message);

    return res.status(200).send({ message: "OTP sent successfully!", generatedOTP });
    
    // const message = {
    //   data: {
    //     title: "Verification OTP",
    //     body: OTP,
    //   },
    //   token: fcmToken,
    // };
    // const response = await admin.messaging().send(message);
    // const otp = new Otp({ number: number, otp: OTP });
    // const salt = await bcrypt.genSalt(10);
    // otp.otp = await bcrypt.hash(otp.otp, salt);
    // const result = await otp.save();
    // return res.status(200).send({ message: "Otp send successfully!", OTP });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const verifyOtpUserController = async (req, res) => {
  try {
    // const { number, otp } = req.body;

    // const otpHolder = await Otp.findOne({ number }).sort({ createdAt: -1 });

    // if (!otpHolder) {
    //   return res.status(400).send("Expired or Invalid OTP!");
    // }

    // const validOTP = await bcrypt.compare(otp, otpHolder.otp);

    // if (validOTP) {
    //   const userExists = await User.findOne({ number });

    //   if (userExists) {
    //     return res.status(400).send("User already registered!");
    //   }

    //   const user = new User({ number });
    //   const token = user.generateJWT();
    //   const result = await user.save();

    //   await Otp.deleteOne({ _id: otpHolder._id });

    //   return res.status(200).send({
    //     message: "User Registration Successful!",
    //     token,
    //     data: result,
    //   });
    // } else {
    //   return res.status(400).send("Invalid OTP!");
    // }
    const { number, otp } = req.body;

    if (!number || !otp) {
      return res.status(400).send("Number and OTP are required.");
    }

    const latestOTP = await Otp.findOne({ number }).sort({ createdAt: -1 });

    if (!latestOTP) {
      return res.status(400).send("Expired or Invalid OTP!");
    }

    const validOTP = await bcrypt.compare(otp, latestOTP.otp);

    if (!validOTP) {
      return res.status(400).send("Invalid OTP!");
    }

    const userExists = await User.findOne({ number });

    if (userExists) {
      return res.status(400).send("User already registered!");
    }

    const newUser = new User({ number });
    const token = newUser.generateJWT();
    const savedUser = await newUser.save();

    await Otp.deleteOne({ _id: latestOTP._id });

    return res.status(200).send({
      message: "User Registration Successful!",
      token,
      data: savedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Specify the directory where images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename file to avoid collisions
  },
});

// Filter for image files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

const uploadProfileImage = async (req, res, next) => {
  try {
    upload.single("profileImage")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).send({ message: "Multer error" });
      } else if (err) {
        console.error("Error during upload:", err); // Log the specific error
        return res.status(500).send({ message: "Error during upload" });
      }

      const uploadedFile = req.file;
      if (!uploadedFile) {
        return res.status(400).send({ message: "No image uploaded" });
      }

      const imageUrl = `http://localhost:1200/uploads/${uploadedFile.filename}`; // Adjust as needed

      const { userId } = req.params;
      const user = await User.findByIdAndUpdate(
        userId,
        { profileImage: imageUrl },
        { new: true }
      );

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      res.json({
        success: true,
        message: "Image uploaded successfully",
        user,
      });
    });
  } catch (error) {
    console.error("Unhandled error:", error); // Log unhandled errors
    res.status(500).send({ message: "Error uploading image" });
  }
};

const updateUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    const { name, email, number, alternateNumber, note } = req.body;
    console.log(name);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Update user fields based on request data
    user.name = name || user.name;
    user.email = email || user.email;
    user.number = number || user.number;
    user.alternateNumber = alternateNumber || user.alternateNumber;
    user.note = note || user.note;

    await user.save();

    res.status(200).send({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error updating user",
    });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you're passing the user ID in the request parameters

    // Check if the user with the given ID exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If the user exists, delete it
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
};

const createRequestController = async (req, res) => {
  try {
    const { userId, testids, quantities, location, paymentMethod } = req.body;

    if (!userId || !testids || !location || !paymentMethod) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required data" });
    }

    const { longitude, latitude } = location;

    const nearbyCollectors = await Collector.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "dist.calculated",
          spherical: true,
          maxDistance: parseFloat(5) * 1000, // Distance in meters (5000km)
        },
      },
      {
        $match: {
          isOnline: true,
          isWorking: false,
          selectedTests: {
            $all: testids.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      },
    ]);

    console.log(nearbyCollectors);

    if (nearbyCollectors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No available collector found for selected tests",
      });
    }

    let selectedCollectorIndex = 0;
    const delayTime = 15000; // 15 seconds in milliseconds

    const sendRequestToCollector = async (collectorIndex) => {
      const selectedCollector = nearbyCollectors[collectorIndex];
      const { fcmToken } = selectedCollector;

      //Notification message content
      const message = {
        data: {
          title: "New Request",
          body: "You have a new test request to process.",
        },
        token: fcmToken,
      };

      // const message = {
      //   topic: "user",
      //   data: {
      //     title: "Check this Mobile (title)",
      //     body: "Rich Notification testing (body)",

      //     sound: "default",
      //   },
      // };

      try {
        // Send notification to the collector
        const response = await admin.messaging().send(message);
        //for calculating the total amount for the following tests
        const testDetails = await Test.find({ _id: { $in: testids } }).lean();
        let totalAmount = 0;
        // Calculate total amount based on tests selected
        testDetails.forEach((test, index) => {
          totalAmount += parseInt(test.price) * quantities[index];
        });
        // Save the request in the database with 'Pending' status
        const newRequest = new Request({
          userId,
          testids,
          collectorId: selectedCollector._id,
          status: "Pending",
          paymentMethod,
          totalAmount,
        });

        const createdRequest = await newRequest.save();

        // Simulate checking the status after a delay
        setTimeout(async () => {
          try {
            const response = await fetch(
              `http://localhost:1200/api/v1/request/request-status/${createdRequest._id}`
            ); // Adjust the endpoint path if needed
            const requestData = await response.json();

            // Simulate a scenario where the status changes to 'Accepted'
            if (
              requestData.success &&
              requestData.request.status === "Accepcted"
            ) {
              // await requestData.request.save();
              return res.status(201).json({
                success: true,
                message: "Collector booked successfully",
                collector: selectedCollector,
                request: requestData.request,
              });
            } else {
              // Move to the next collector if available
              if (collectorIndex < nearbyCollectors.length - 1) {
                sendRequestToCollector(collectorIndex + 1);
              } else {
                // No more collectors available to send the request
                return res.status(400).json({
                  success: false,
                  message: "All collectors rejected the request",
                });
              }
            }
          } catch (error) {
            console.error("Error checking request status:", error);
            return res.status(500).json({
              success: false,
              message: "Error checking request status",
            });
          }
        }, 60000);
      } catch (error) {
        console.error("Error sending notification:", error);
        return res.status(500).json({
          success: false,
          message: "Error sending notification to the collector",
        });
      }
    };

    // Start the process by sending the request to the first collector
    sendRequestToCollector(selectedCollectorIndex);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Error booking collector" });
  }
};

const updateNotificationStatusController = async (req, res) => {
  try {
    const { notificatioStatus } = req.body;
    const { userId } = req.params;
    // Find the user by ID and update the notificationStatus field
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { notificatioStatus } },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).send({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Failed to update notification status",
    });
  }
};

module.exports = {
  signupUserController,
  verifyOtpUserController,
  updateUserController,
  deleteUserController,
  createRequestController,
  updateNotificationStatusController,
  uploadProfileImage,
};
