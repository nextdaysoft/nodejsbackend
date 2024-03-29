const Collector = require("../model/collectorModel");
const Request = require("../model/requestModel");
const bcrypt = require("bcrypt");
const { comparePassword, hashPassword } = require("../helper/authHelper");
const multer = require("multer");
const jwt = require("jsonwebtoken");

//file uploads
const fs = require("fs");
const path = require("path");
const directory = "uploads";
// Create the 'uploads' directory if it doesn't exist
if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory);
  console.log(`'${directory}' directory created.`);
} else {
  console.log(`'${directory}' directory already exists.`);
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directory);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};
const upload = multer({
  storage,
  fileFilter,
});
// const upload = multer({
// storage: storage,
// limits: { fileSize: 1024 * 1024 * 5 },
// }).single("profileImage");
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

      const imageUrl = `https://famous-foal-khakis.cyclic.app/${uploadedFile.filename}`; // Adjust as needed

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

// const signupCollectorController = async (req, res) => {
//   try {
//     const {
//       fullName,
//       companyName,
//       phoneNumber,
//       email,
//       address,
//       password,
//       gender,
//       yearOfExperience,
//       selectedTests,
//       note,
//       testNames,
//     } = req.body;
// console.log(req.body)
//     // Ensure required fields are present and valid
//     if (!fullName || !email || !password) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing required fields" });
//     }

//     const existingCollector = await Collector.findOne({ email });
//     if (existingCollector) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Collector already exists" });
//     }

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const collector = new Collector({
//       fullName,
//       companyName,
//       phoneNumber,
//       email,
//       address,
//       password: hashedPassword,
//       gender,
//       yearOfExperience,
//       selectedTests,
//       note,
//       testNames,
//     });

//     // Access certificates from req.files
//     const { certificates } = req.files;

//     // Ensure certificates are present and it's an array
//     if (
//       !certificates ||
//       !Array.isArray(certificates) ||
//       certificates.length === 0
//     ) {
//       return res
//         .status(400)
//         .json({
//           success: false,
//           message: "No images uploaded or invalid format",
//         });
//     }

//     const promises = certificates.map(async (certificate) => {
//       // Validation for the size of each certificate
//       if (certificate.size > 1000000) {
//         return res.status(400).json({
//           error: "Each certificate should be less than 1MB in size",
//         });
//       }

//       return {
//         data: fs.readFileSync(certificate.path),
//         contentType: certificate.type,
//       };
//     });

//     const certificateData = await Promise.all(promises);

//     // Push certificate data into collector.certificates array
//     certificateData.forEach((data) => {
//       collector.certificates.push(data);
//     });

//     await collector.save();

//     return res.status(201).json({
//       success: true,
//       message:
//         "Your documents have been sent for verification. You'll receive a notification upon verification.",
//       collector,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ success: false, error, message: "Error creating Collector" });
//   }
// };

// const signupCollectorController = async (req, res) => {
//   try {
//     const form = formidable({ multiples: true });
//     await form.parse(req, async (err, fields, files) => {
//       if (err) {
//         return res.status(500).json({ success: false, error: err.message });
//       }

//       const {
//         fullName,
//         companyName,
//         phoneNumber,
//         email,
//         address,
//         password,
//         gender,
//         yearOfExperience,
//         selectedTests,
//         note,
//         testNames,
//       } = fields;
// console.log(fields)
//       // ... (rest of your field validation and collector creation logic)
//       // Ensure required fields are present and valid
//       if (!fullName || !email || !password) {
//         return res
//           .status(400)
//           .json({ success: false, message: "Missing required fields" });
//       }

//       const existingCollector = await Collector.findOne({ email });
//       if (existingCollector) {
//         return res
//           .status(400)
//           .json({ success: false, message: "Collector already exists" });
//       }

//       const saltRounds = 10;
//       const hashedPassword = await bcrypt.hash(password, saltRounds);

//       const collector = await new Collector({
//         fullName,
//         companyName,
//         phoneNumber,
//         email,
//         address,
//         password: hashedPassword,
//         gender,
//         yearOfExperience,
//         selectedTests,
//         note,
//         testNames,
//       });
//       // Accessing multiple certificates from Formidable's files object
//       const certificates = files.certificates;

//       if (!certificates || certificates.length === 0) {
//         return res
//           .status(400)
//           .json({ success: false, message: "No images uploaded" });
//       }

//       // Processing multiple certificates
//       collector.certificates = [];
//       certificates.forEach((certificate) => {
//         // Validation for the size of each certificate
//         if (certificate.size > 1000000) {
//           return res.status(500).send({
//             error: "Each certificate should be less than 1MB in size",
//           });
//         }
//         collector.certificates.push({
//           data: fs.readFileSync(certificate.filepath), // Use filepath for Formidable
//           contentType: certificate.mimetype, // Use mimetype for Formidable
//         });
//       });
//       await collector.save();
//       return res.status(201).send({
//         success: true,
//         message:
//           "Your documents have been sent for verification. You'll receive a notification upon verification.",
//         collector,
//       });
//     });
//   } catch (error) {
//     return res.status(500).send({
//       error,
//     });
//   }
// };
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
      return res.status(200).json({
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
    const token = await jwt.sign(
      { _id: collector._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    // Password is valid, collector logged in successfully
    return res.status(200).json({
      success: true,
      message: "Your request has been successfully submitted to the administration for review. As of the current moment, the documents are pending verification. You will receive a notification once the verification process is complete. Following the successful verification, you will be able to proceed with signing in to your account. Thank you for your patience and cooperation.",
      collector,
      token,
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
const signupCollectorController = async (req, res) => {
  try {
    const {
      fullName,
      companyName,
      phoneNumber,
      email,
      address,
      password,
      gender,
      yearOfExperience,
      selectedTests,
      note,
      testNames,
    } = req.body;
    //console.log(req);
    // Ensure required fields are present and valid
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const existingCollector = await Collector.findOne({ email });
    if (existingCollector) {
      return res
        .status(400)
        .json({ success: false, message: "Collector already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const collector = new Collector({
      fullName,
      companyName,
      phoneNumber,
      email,
      address,
      password: hashedPassword,
      gender,
      yearOfExperience,
      selectedTests,
      note,
      testNames,
    });

   
    upload.array("certificates", 10)(req, res, async function (err) {
      // if (err instanceof multer.MulterError) {
      //   return res.status(400).send({ message: "Multer error" });
      // } else if (err) {
      //   console.error("Error during upload:", err);
      //   return res.status(500).send({ message: "Error during upload" });
      // }

      const uploadedFiles = req.files;
      console.log(req.files)
      if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).send({ message: "No images uploaded" });
      }

      // Assuming 'collector' is an object where you want to store these files
      const imageUrls = uploadedFiles.map((file) => {
        return `http://localhost:1200/${file.path}`; // Adjust the URL structure based on your server setup
      });

      collector.certificates = imageUrls;

      try {
        await collector.save(); // Wait for the collector data to be saved
        return res.status(201).json({
          success: true,
          message: "Your documents have been sent to the admin for verification. You will receive a notification once the documents are verified. After verification, you will be able to log in with the account you registered.",
          collector,
        });
      } catch (saveError) {
        console.error(saveError);
        return res.status(500).json({
          success: false,
          error: saveError,
          message: "Error saving Collector data",
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error, message: "Error creating Collector" });
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
    } = req.body;

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

    const collector=Collector.findById(collectorId);
    if(collector.isWorking==true){
      return res.status(200).json({message:"Unable to go offline task pending"})
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

const testController = (req, res) => {
  try {
    res.status(200).send({
      message: "protected route",
    });
  } catch (error) {
    console.log(error);
  }
};
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
  testController,
};
