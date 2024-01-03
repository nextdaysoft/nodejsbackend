const Collector = require("../model/collectorModel");
const Request = require("../model/requestModel");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { comparePassword, hashPassword } = require("../helper/authHelper");
const multer = require("multer");
const jwt =require("jsonwebtoken")
// Set up multer storage and file naming
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

      const imageUrl = `http://localhost:1200/${uploadedFile.filename}`; // Adjust as needed

      const { collectorId } = req.params;
      const collector = await Collector.findByIdAndUpdate(
        collectorId,
        { profileImage: imageUrl },
        { new: true }
      );

      if (!collector) {
        return res.status(404).send({ message: "Collector not found" });
      }

      res.json({
        success: true,
        message: "Image uploaded successfully",
        collector,
      });
    });
  } catch (error) {
    console.error("Unhandled error:", error); // Log unhandled errors
    res.status(500).send({ message: "Error uploading image" });
  }
};
const uploadCertificates = async (req, res, next) => {
  try {
    upload.array("certificates", 10)(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).send({ message: "Multer error" });
      } else if (err) {
        console.error("Error during upload:", err); // Log the specific error
        return res.status(500).send({ message: "Error during upload" });
      }

      const uploadedFiles = req.files;
      if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).send({ message: "No images uploaded" });
      }

      const imageUrls = uploadedFiles.map((file) => {
        return `http://localhost:1200/uploads/${file.filename}`; // Adjust as needed
      });

      // Handle logic to associate these image URLs with your collector or user
      const { collectorId } = req.params;
      const collector = await Collector.findByIdAndUpdate(
        collectorId,
        { $push: { certificates: { $each: imageUrls } } },
        { new: true }
      );

      if (!collector) {
        return res.status(404).send({ message: "Collector not found" });
      }

      res.json({
        success: true,
        message: "Images uploaded successfully",
        collector,
      });
    });
  } catch (error) {
    console.error("Unhandled error:", error); // Log unhandled errors
    res.status(500).send({ message: "Error uploading images" });
  }
};

const signupCollectorController = async (req, res) => {
  try {
    const {
      fullName,
      companyName,
      phoneNumber,
      email,
      address,
      password,
      confirmPassword,
      gender,
      yearOfExperience,
      selectedTests,
      note,
      longitude,
      latitude,
      testNames,
      fcmToken
    } = req.body;

    const existingCollector = await Collector.findOne({ email });
    if (existingCollector) {
      return res.status(400).send({
        message: "Collector already exists",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).send({
        message: "Password and Confirm Password do not match",
      });
    }

    const hashedPassword = await hashPassword(password); // Hashing the password

    const collector = new Collector({
      fullName,
      companyName,
      phoneNumber,
      email,
      address,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      gender,
      yearOfExperience,
      selectedTests,
      note,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      testNames,
      fcmToken
      // other fields...
    });

    await collector.save();
    return res.status(201).send({
      success: true,
      message: "Collector Created Successfully",
      collector,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error in creating Collector",
    });
  }
};

const loginCollectorController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // Find the collector by email
    const collector = await Collector.findOne({ email });

    if (!collector) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered",
      });
    }

    // Check if the collector exists and if the password matches
    const isPasswordValid = await bcrypt.compare(password, collector.password);

    if (!isPasswordValid) {
      return res.status(200).json({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await jwt.sign({ _id: collector._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    // Password is valid, collector logged in successfully
    return res.status(200).json({
      success: true,
      message: "Collector logged in successfully",
      collector: {
        _id: collector._id,
        email: collector.email,
        // Include other necessary collector data here (avoid sensitive data)
      },
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in login Collector",
      error: error.message, // Include the error message for debugging
    });
  }
};

const updateCollectorController = async (req, res) => {
  try {
    const { collectorId } = req.params; // Assuming 'id' is the identifier of the collector

    const {
      fullName,
      companyName,
      phoneNumber,
      email,
      address,
      gender,
      yearOfExperience,

      note,
    } = req.fields;

    const collector = await Collector.findById(collectorId);

    if (!collector) {
      return res.status(404).send({
        success: false,
        message: "Collector not found",
      });
    }

    // Update collector fields
    collector.fullName = fullName || collector.fullName;
    collector.companyName = companyName || collector.companyName;
    collector.phoneNumber = phoneNumber || collector.phoneNumber;
    collector.email = email || collector.email;
    collector.address = address || collector.address;
    collector.gender = gender || collector.gender;
    collector.yearOfExperience = yearOfExperience || collector.yearOfExperience;

    collector.note = note || collector.note;

    await collector.save();

    res.status(200).send({
      success: true,
      message: "Collector updated successfully",
      collector,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error updating collector",
    });
  }
};
const deleteCollectorController = async (req, res) => {
  try {
    const { collectorId } = req.params; // Assuming 'id' is the identifier of the collector

    const collector = await Collector.findById(collectorId);

    if (!collector) {
      return res.status(404).send({
        success: false,
        message: "Collector not found",
      });
    }

    await Collector.findByIdAndDelete(collectorId);

    res.status(200).send({
      success: true,
      message: "Collector deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error deleting collector",
    });
  }
};

const updateLocationController = async (req, res) => {
  try {
    // Extract location data from request body
    const { longitude, latitude } = req.body;
    // Get collector ID from authorization header or body (modify based on your authentication strategy)
    const { collectorId } = req.params;

    // Validate data
    if (
      !longitude ||
      !latitude ||
      typeof longitude !== "number" ||
      typeof latitude !== "number"
    ) {
      return res.status(400).send("Invalid location data");
    }

    // Update collector document with new location
    const updatedCollector = await Collector.findByIdAndUpdate(
      collectorId,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude], // Ensure correct order
        },
      },
      { new: true }
    );

    // Check for successful update
    if (!updatedCollector) {
      return res.status(404).send("Collector not found");
    }

    // Respond with success message and updated collector data
    res.status(200).send({
      message: "Location updated successfully",
      collector: updatedCollector,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating collector location");
  }
};

const updateOnlineAndOfflineStatusController = async (req, res) => {
  try {
    const { collectorId } = req.params;
    const { isOnline } = req.body;

    // Validate isOnline as a boolean
    if (typeof isOnline !== "boolean") {
      return res.status(400).send({
        success: false,
        error: "Invalid isOnline value. Must be a boolean.",
      });
    }

    const updatedCollector = await Collector.findByIdAndUpdate(
      collectorId,
      {
        isOnline,
      },
      { new: true }
    );

    if (!updatedCollector) {
      return res.status(404).send({
        success: false,
        error: "Collector not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Collector status updated successfully",
      updatedCollector,
    }); // Omit updatedCollector if not needed in response
  } catch (error) {
    console.error(error); // Log error with details
    res.status(500).send({
      success: false,
      error: "Failed to update collector status",
      message: "Internal server error",
    });
  }
};

const countRequestsForCollectorController = async (req, res) => {
  try {
    const { collectorId } = req.params;
    const collector = Collector.findById(collectorId);
    if (!collector) {
      return res.status(404).send({
        success: false,
        message: "No Collector present with this id",
      });
    }
    const requests = await Request.find({ collectorId });
    if (requests.length == 0) {
      return res.status(404).send({
        success: false,
        message: "There are no request for you",
      });
    } else {
      return res.status(200).send({
        success: true,
        count: requests.length,
        requests: requests,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in getting count of request",
    });
  }
};
const countPendingRequestsController = async (req, res) => {
  try {
    const { collectorId } = req.params;
    const collector = Collector.findById(collectorId);
    if (!collector) {
      return res.status(404).send({
        success: false,
        message: "No Collector present with this id",
      });
    }
    const pendingRequests = await Request.find({
      collectorId,
      status: "Pending",
    });

    return res.status(200).send({
      pendingCount: pendingRequests.length,
      pending: pendingRequests,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in finding pending  requests",
    });
  }
};
const countRejectedRequestsController = async (req, res) => {
  try {
    const { collectorId } = req.params;
    const collector = Collector.findById(collectorId);
    if (!collector) {
      return res.status(404).send({
        success: false,
        message: "No Collector present with this id",
      });
    }

    const rejectedRequests = await Request.find({
      collectorId,
      status: "Rejected",
    });

    return res.status(200).send({
      rejectedCount: rejectedRequests.length,
      reject: rejectedRequests,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in finding  rejected requests",
    });
  }
};
const countAccepctedRequestsController = async (req, res) => {
  try {
    const { collectorId } = req.params;
    const collector = Collector.findById(collectorId);
    if (!collector) {
      return res.status(404).send({
        success: false,
        message: "No Collector present with this id",
      });
    }
    const accepctedRequests = await Request.find({
      collectorId,
      status: "Accepcted",
    });

    return res.status(200).send({
      accepctCount: accepctedRequests.length,
      accepct: accepctedRequests,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in finding accepcted requests",
    });
  }
};

const recentRequestController = async (req, res) => {
  const { collectorId } = req.params;

  try {
    // Find the most recent request corresponding to the collectorId
    const recentRequest = await Request.findOne({ collectorId })
      .sort({ createdAt: -1 }) // Sort by 'createdAt' in descending order to get the most recent request
      .populate("userId") // Populate additional user fields if needed
      .exec();

    if (!recentRequest) {
      return res.status(404).json({
        success: false,
        message: "No recent request found for the collector",
      });
    }

    return res.status(200).json({ success: true, recentRequest });
  } catch (error) {
    console.error("Error finding recent request:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error finding recent request" });
  }
};

const testController=(req,res)=>{
  try {
    res.status(200).send({
      message:"protected route"
    })
    
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  signupCollectorController,
  loginCollectorController,
  updateCollectorController,
  deleteCollectorController,
  updateLocationController,
  updateOnlineAndOfflineStatusController,
  uploadProfileImage,
  uploadCertificates,
  countRequestsForCollectorController,
  countPendingRequestsController,
  countRejectedRequestsController,
  countAccepctedRequestsController,
  recentRequestController,
  testController
};
