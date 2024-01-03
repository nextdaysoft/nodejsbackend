const Collector = require("../model/collectorModel");
const User = require("../model/userModel");
const admin = require('firebase-admin');
const Admin=require("../model/adminModel")
const jwt =require('jsonwebtoken')

const verifyCollectorController = async (req, res) => {
  try {
    const { verificationStatus } = req.body;
    const { collectorId } = req.params;
    //console.log(collectorId);

    // Validate request ID and new status
    if (!verificationStatus) {
      return res.status(400).json({
        success: false,
        message: "Missing required data",
      });
    }

    // Check if the request ID is valid
    const existingCollector = await Collector.findById(collectorId);
    if (!existingCollector) {
      return res.status(404).json({
        success: false,
        message: "Collector not found",
      });
    }

    // Update the request status
    existingCollector.verificationStatus = verificationStatus;
    existingCollector.updatedAt = Date.now(); // Update updatedAt field

    // Save the updated request
    const updatedCollector = await existingCollector.save();

    return res.status(200).json({
      success: true,
      message: "Collector's Verification  status updated successfully",
      updatedCollector: updatedCollector,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating Verification status",
    });
  }
};

const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No users are present",
      });
    } else {
      return res.status(200).send({
        success: true,
        users,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching users",
    });
  }
};

const getSpecficUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: true,
        message: "User is not present",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "User found",
        user: user,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error retrieving user",
    });
  }
};
const getAllCollectorsController = async (req, res) => {
  try {
    const collectors = await Collector.find({});

    if (collectors.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Collectors are present",
      });
    } else {
      return res.status(200).send({
        success: true,
        collectors,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching collectors",
    });
  }
};

const getSpecficCollectorController = async (req, res) => {
  try {
    const { collectorId } = req.params;
    const collector = await Collector.findById(collectorId);

    if (!collector) {
      return res.status(404).send({
        success: true,
        message: "Collector is not present",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Collector found",
        collector: collector,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error retrieving user",
    });
  }
};

const getAllPendingCollectorsCollectors = async (req, res) => {
  try {
    const pendingCollectors = await Collector.find({
      verificationStatus: "Pending",
    }).sort({ createdAt: -1 });;
    if (pendingCollectors.length == 0) {
      return res.status(404).send({
        success: false,
        message: "No collectors with pending verification status",
      });
    } else {
      return res.status(200).send({
        success: true,
        pendingCollectors: pendingCollectors,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error retrieving pending collectors",
    });
  }
};
const getAllRejectedCollectorsCollectors = async (req, res) => {
  try {
    const rejectedCollectors = await Collector.find({
      verificationStatus: "Rejected",
    });
    if (rejectedCollectors.length == 0) {
      return res.status(404).send({
        success: false,
        message: "No collectors with reject verification status",
      });
    } else {
      return res.status(200).send({
        success: true,
        rejectedCollectors: rejectedCollectors,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error retrieving rejected collectors",
    });
  }
};
const getAllAccepctedCollectorsCollectors = async (req, res) => {
  try {
    const accepctedCollectors = await Collector.find({
      verificationStatus: "Accepcted",
    });
    if (accepctedCollectors.length == 0) {
      return res.status(404).send({
        success: false,
        message: "No collectors with accepct verification status",
      });
    } else {
      return res.status(200).send({
        success: true,
        accepctedCollectors: accepctedCollectors,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error retrieving accepcted collectors",
    });
  }
};
const notificationToAllUsersController = async (req, res) => {
  const { title, body } = req.body;
  try {
    if (!body || !title) {
      return res.status(400).send({
        message: "Please fill all the required fields",
        success: false,
      });
    }
    const message = {
      topic: "user",
      data: {
        title,
        body,
        sound: "default",
      },
    };
    const response = await admin.messaging().send(message);
    return res.status(200).json({
      success: true,
      message: "Notifications sent successfully to all users",
      response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in sending notifications to all users",
    });
  }
};
const notificationToAllCollectorController = async (req, res) => {
  const { title, body } = req.body;
  try {
    if (!body || !title) {
      return res.status(400).send({
        message: "Please fill all the required fields",
        success: false,
      });
    }
    const message = {
      topic: "collectors",
      data: {
        title,
        body,
        sound: "default",
      },
    };
    const response = await admin.messaging().send(message);
    return res.status(200).json({
      success: true,
      message: "Notifications sent successfully to all Collectors",
      response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in sending notifications to all Collectors",
    });
  }
};
const notificationToAllController = async (req, res) => {
  const { title, body } = req.body;
  try {
    if (!body || !title) {
      return res.status(400).send({
        message: "Please fill all the required fields",
        success: false,
      });
    }
    const message = {
      topic: "user || collectors",
      data: {
        title,
        body,
        sound: "default",
      },
    };
    const response = await admin.messaging().send(message);
    return res.status(200).json({
      success: true,
      message: "Notifications sent successfully to all ",
      response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in sending notifications to all ",
    });
  }
};
const notificationToSpecficPersonController = async (req, res) => {
  const { title, body,fcmToken } = req.body;
  try {
    if (!body || !title || !fcmToken) {
      return res.status(400).send({
        message: "Please fill all the required fields",
        success: false,
      });
    }
    const message = {
      data: {
        title,
        body
      },
      token: fcmToken,
    };

    const response = await admin.messaging().send(message);
    return res.status(200).json({
      success: true,
      message: "Notifications sent successfully to the person ",
      response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in sending notifications to the person ",
    });
  }
};
const loginAdminController=async(req,res)=>{
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create and return a JWT token upon successful authentication
    const token = jwt.sign({ email: admin.email, _id: admin._id }, 'your-secret-key', { expiresIn: '7d' });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllUsersController,
  getSpecficCollectorController,
  getSpecficUserController,
  getAllCollectorsController,
  verifyCollectorController,
  getAllPendingCollectorsCollectors,
  getAllRejectedCollectorsCollectors,
  getAllAccepctedCollectorsCollectors,
  notificationToAllUsersController,
  notificationToAllCollectorController,
  notificationToAllController,
  notificationToSpecficPersonController,
  loginAdminController,
  
};
