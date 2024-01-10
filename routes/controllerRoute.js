const express = require("express");
const Collector=require('../model/collectorModel')
const bcrypt=require('bcrypt')
const {
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
} = require("../controller/collectorController");
const formidable = require("express-formidable");
const {
  requireSignIn,
  verifyCollectorStatus,
} = require("../middleware/authMiddleware");
const mu = require("../middleware/multipleImageUpload"); // Path to your multer middleware
const router = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *    Collector:
 *      type: object
 *      properties:
 *        profileImage:
 *          type: object
 *          properties:
 *            data:
 *              type: string
 *              format: binary
 *              description: Image data stored as a Buffer
 *            contentType:
 *              type: string
 *              description: Image content type
 *        certificates:
 *          type: array
 *          items:
 *            type: string
 *            description: URLs to certificates
 *        fullName:
 *          type: string
 *          description: Collector's full name
 *        companyName:
 *          type: string
 *          description: Company name associated with the collector
 *        phoneNumber:
 *          type: string
 *          description: Collector's phone number
 *        email:
 *          type: string
 *          description: Collector's email (unique)
 *        address:
 *          type: string
 *          description: Collector's address
 *        password:
 *          type: string
 *          description: Collector's password
 *        gender:
 *          type: string
 *          enum:
 *            - Male
 *            - Female
 *            - Other
 *          description: Gender of the collector
 *        selectedTests:
 *          type: array
 *          items:
 *            type: string
 *            format: uuid
 *            description: Reference to Test IDs
 *        yearOfExperience:
 *          type: number
 *          description: Collector's years of experience
 *        testNames:
 *          type: array
 *          items:
 *            type: string
 *            description: Names of tests selected by the collector
 *        location:
 *          type: object
 *          properties:
 *            type:
 *              type: string
 *            coordinates:
 *              type: array
 *              items:
 *                type: number
 *              description: Longitude and latitude coordinates
 *          description: Collector's location
 *        note:
 *          type: string
 *          description: Additional notes about the collector
 *        isOnline:
 *          type: boolean
 *          description: Indicates if the collector is online
 *        verificationStatus:
 *          type: string
 *          enum:
 *            - Pending
 *            - Accepted
 *            - Rejected
 *          description: Verification status of the collector
 *        fcmToken:
 *          type: string
 *          description: Collector's FCM token
 *        isWorking:
 *          type: boolean
 *          description: Indicates if the collector is currently working
 *        testRunning:
 *          type: string
 *          format: uuid
 *          description: Reference to a running test ID associated with the collector
 *      required:
 *        - fullName
 *        - email
 *        - phoneNumber
 *        - password
 */
/**
 *  @swagger
 *  tags:
 *    name: User
 *    description: User apis
 */

/**
 * @swagger
 * /api/v1/collector/signup:
 *   post:
 *     summary: Register a new collector
 *     description: Register a new collector with required information
 *     tags:
 *       - Collector
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               companyName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum:
 *                   - Male
 *                   - Female
 *                   - Other
 *               yearOfExperience:
 *                 type: number
 *               selectedTests:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *               note:
 *                 type: string
 *               longitude:
 *                 type: number
 *               latitude:
 *                 type: number
 *               testNames:
 *                 type: array
 *                 items:
 *                   type: string
 *               fcmToken:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Collector created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Collector Created Successfully
 *                 collector:
 *                   $ref: '#/components/schemas/Collector'
 *       '400':
 *         description: Bad request. Collector already exists or Passwords do not match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Collector already exists or Passwords do not match
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   example: {}
 *                 message:
 *                   type: string
 *                   example: Error in creating Collector
 */

// router.post("/signup", multipleImageUpload,signupCollectorController);
const multer = require("multer");

// Set storage and file handling options for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set the filename (can be customized as per your requirement)
  },
});

// Create the Multer instance with configuration
const upload = multer({ storage: storage });
router.post("/signup", upload.array("certificates", 10), async (req, res) => {
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
    const uploadedFiles = req.files;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).send("No files were uploaded.");
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
        message: "Your documents have been sent for verification.",
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
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error, message: "Error creating Collector" });
  }
});
/**
 * @swagger
 * /api/v1/collectorlogin:
 *   post:
 *     summary: Login for collectors
 *     description: Login for registered collectors
 *     tags:
 *       - Collector
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Collector logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Collector logged in successfully
 *                 collector:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Collector's unique identifier
 *                       example: DHSASDHJDJHVAJDSVJAVSD
 *                     email:
 *                       type: string
 *                       description: Collector's email address
 *                       example: johndoe@example.com
 *                     # Include other necessary collector data here (avoid sensitive data)
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       '400':
 *         description: Bad request. Please provide both email and password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please provide both email and password
 *       '404':
 *         description: Email is not registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email is not registered
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error in login Collector
 *                 error:
 *                   type: string
 *                   example: Error message providing details about the error
 */

router.post("/login", loginCollectorController);
/**
 * @swagger
 *  /api/v1/collector/update/{collectorId}:
 *  post:
 *   summary: Update collector details
 *   description: Update the information of a collector
 *   tags:
 *     - Collector
 *   parameters:
 *     - name: collectorId
 *       in: path
 *       required: true
 *       description: The ID of the collector to be updated
 *       schema:
 *         type: string
 *   requestBody:
 *     required: true
 *     content:
 *       application/x-www-form-urlencoded:
 *         schema:
 *           type: object
 *           properties:
 *             fullName:
 *               type: string
 *               description: Collector's full name
 *             companyName:
 *               type: string
 *               description: Company name associated with the collector
 *             phoneNumber:
 *               type: string
 *               description: Collector's phone number
 *             email:
 *               type: string
 *               description: Collector's email (unique)
 *             address:
 *               type: string
 *               description: Collector's address
 *             gender:
 *               type: string
 *               enum: [Male, Female, Other]
 *               description: Gender of the collector
 *             yearOfExperience:
 *               type: number
 *               description: Collector's years of experience
 *             note:
 *               type: string
 *               description: Additional notes about the collector
 *   responses:
 *     '200':
 *       description: Collector updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: true
 *                 description: Indicates if the operation was successful
 *               message:
 *                 type: string
 *                 example: Collector updated successfully
 *                 description: A success message indicating the update was successful
 *               collector:
 *                 $ref: '#/components/schemas/Collector'
 *                 description: Updated collector details
 *     '404':
 *       description: Collector not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *                 description: Indicates if the operation was unsuccessful
 *               message:
 *                 type: string
 *                 example: Collector not found
 *                 description: Error message indicating the collector was not found
 *     '500':
 *       description: Error updating collector
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *                 description: Indicates if the operation was unsuccessful
 *               error:
 *                 type: object
 *                 example: {}
 *                 description: Details about the encountered error
 *               message:
 *                 type: string
 *                 example: Error updating collector
 *                 description: Error message indicating the failure to update the collector
 */

router.put("/update/:collectorId", updateCollectorController);
/**
 * @swagger
 * /api/v1/collector/delete/{collectorId}:
 *   delete:
 *     summary: Delete collector
 *     description: Delete a collector by ID
 *     tags:
 *       - Collector
 *     parameters:
 *       - name: collectorId
 *         in: path
 *         required: true
 *         description: ID of the collector to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Collector deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates if the operation was successful
 *                 message:
 *                   type: string
 *                   example: Collector deleted successfully
 *                   description: A success message indicating the deletion was successful
 *       '404':
 *         description: Collector not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if the operation was unsuccessful
 *                 message:
 *                   type: string
 *                   example: Collector not found
 *                   description: Error message indicating the collector was not found
 *       '500':
 *         description: Error deleting collector
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if the operation was unsuccessful
 *                 error:
 *                   type: object
 *                   example: {}
 *                   description: Details about the encountered error
 *                 message:
 *                   type: string
 *                   example: Error deleting collector
 *                   description: Error message indicating the failure to delete the collector
 */

router.delete("/delete/:collectorId", deleteCollectorController);
/**
 * @swagger
 * /api/v1/collector/update-location/{collectorId}:
 *   put:
 *     summary: Update collector location
 *     description: Update the location of a collector by ID
 *     tags:
 *       - Collector
 *     parameters:
 *       - name: collectorId
 *         in: path
 *         required: true
 *         description: ID of the collector to update location
 *         schema:
 *           type: string
 *       - name: longitude
 *         in: query
 *         required: true
 *         description: Longitude coordinate
 *         schema:
 *           type: number
 *       - name: latitude
 *         in: query
 *         required: true
 *         description: Latitude coordinate
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Location updated successfully
 *                   description: A success message indicating the location was updated
 *                 collector:
 *                   $ref: '#/components/schemas/Collector'
 *                   description: Updated collector with new location
 *       '400':
 *         description: Invalid location data
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Invalid location data
 *               description: Error message for invalid location data
 *       '404':
 *         description: Collector not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Collector not found
 *               description: Error message indicating the collector was not found
 *       '500':
 *         description: Error updating collector location
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Error updating collector location
 *               description: Error message indicating the failure to update the collector location
 */

router.put("/update-location/:collectorId", updateLocationController);
/**
 * @swagger
 * /api/v1/collector/update-status/{collectorId}:
 *   put:
 *     summary: Update collector online/offline status
 *     description: Update the online/offline status of a collector by ID
 *     tags:
 *       - Collector
 *     parameters:
 *       - name: collectorId
 *         in: path
 *         required: true
 *         description: ID of the collector to update status
 *         schema:
 *           type: string
 *       - name: isOnline
 *         in: query
 *         required: true
 *         description: Collector's online status
 *         schema:
 *           type: boolean
 *     responses:
 *       '200':
 *         description: Collector status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates if the operation was successful
 *                 message:
 *                   type: string
 *                   example: Collector status updated successfully
 *                   description: A success message indicating the status was updated
 *                 updatedCollector:
 *                   $ref: '#/components/schemas/Collector'
 *                   description: Updated collector with new status
 *       '400':
 *         description: Invalid isOnline value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if the operation failed due to invalid data
 *                 error:
 *                   type: string
 *                   example: Invalid isOnline value. Must be a boolean.
 *                   description: Error message for invalid status value
 *       '404':
 *         description: Collector not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if the operation failed due to collector not found
 *                 error:
 *                   type: string
 *                   example: Collector not found
 *                   description: Error message indicating the collector was not found
 *       '500':
 *         description: Failed to update collector status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if the operation failed due to internal server error
 *                 error:
 *                   type: string
 *                   example: Failed to update collector status
 *                   description: Error message indicating the failure to update the collector status
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                   description: Error message indicating the internal server error
 */

router.put(
  "/update-status/:collectorId",
  updateOnlineAndOfflineStatusController
);
/**
 * @swagger
 * /api/v1/collector/upload-profile-image/{collectorId}/:
 *   post:
 *     summary: Upload profile image for a collector
 *     tags:
 *       - Collector
 *     parameters:
 *       - in: path
 *         name: collectorId
 *         required: true
 *         description: ID of the collector to update profile image
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: The profile image to upload
 *     responses:
 *       '200':
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates if the operation was successful
 *                 message:
 *                   type: string
 *                   example: Image uploaded successfully
 *                   description: A success message indicating the image upload was successful
 *                 collector:
 *                     $ref: '#/components/schemas/Collector'
 *                     description: Collector with updated profile image
 *       '400':
 *         description: Bad request - Invalid input, no image uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No image uploaded
 *                   description: Error message for invalid input (no image uploaded)
 *       '404':
 *         description: Collector not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Collector not found
 *                   description: Error message indicating the collector was not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error uploading image
 *                   description: Error message indicating an issue with image upload
 */

router.post("/upload-profile-image/:collectorId", uploadProfileImage);
router.post("/upload-certificates-image/:collectorId", uploadCertificates);
/**
 * @swagger
 * /api/v1/collector/getCountForRequest/{collectorId}:
 *   get:
 *     summary: Count requests for a collector
 *     description: Retrieve the count and details of requests associated with a collector
 *     tags:
 *       - Collector
 *     parameters:
 *       - name: collectorId
 *         in: path
 *         required: true
 *         description: ID of the collector to retrieve requests count
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Requests count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates if the operation was successful
 *                 count:
 *                   type: integer
 *                   example: 5
 *                   description: Number of requests associated with the collector
 *                 requests:
 *                   type: array
 *                   description: List of requests associated with the collector
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *       '404':
 *         description: No requests found for the collector
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if no requests were found
 *                 message:
 *                   type: string
 *                   example: There are no requests for you
 *                   description: Message indicating no requests found for the collector
 *       '500':
 *         description: Error in getting count of requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if an error occurred while getting request count
 *                 message:
 *                   type: string
 *                   example: Error in getting count of requests
 *                   description: Error message indicating the failure to get request count
 */

router.get(
  "/getCountForRequest/:collectorId",
  countRequestsForCollectorController
);
/**
 * @swagger
 * /api/v1/collector/getCountForPendingRequest/{collectorId}:
 *   get:
 *     summary: Count pending requests for a collector
 *     description: Retrieve the count and details of pending requests associated with a collector
 *     tags:
 *       - Collector
 *     parameters:
 *       - name: collectorId
 *         in: path
 *         required: true
 *         description: ID of the collector to retrieve pending requests count
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Pending requests count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pendingCount:
 *                   type: integer
 *                   example: 5
 *                   description: Number of pending requests associated with the collector
 *                 pending:
 *                   type: array
 *                   description: List of pending requests associated with the collector
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *       '404':
 *         description: No pending requests found for the collector
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if no pending requests were found
 *                 message:
 *                   type: string
 *                   example: No pending requests found for the collector
 *                   description: Message indicating no pending requests found for the collector
 *       '500':
 *         description: Error in finding pending requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if an error occurred while finding pending requests
 *                 message:
 *                   type: string
 *                   example: Error in finding pending requests
 *                   description: Error message indicating the failure to find pending requests
 */

router.get(
  "/getCountForPendingRequest/:collectorId",
  countPendingRequestsController
);
/**
 * @swagger
 * /api/v1/collector/getCountForRejectedRequest/{collectorId}:
 *   get:
 *     summary: Count rejected requests for a collector
 *     description: Retrieve the count and details of rejected requests associated with a collector
 *     tags:
 *       - Collector
 *     parameters:
 *       - name: collectorId
 *         in: path
 *         required: true
 *         description: ID of the collector to retrieve rejected requests count
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Rejected requests count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rejectedCount:
 *                   type: integer
 *                   example: 3
 *                   description: Number of rejected requests associated with the collector
 *                 reject:
 *                   type: array
 *                   description: List of rejected requests associated with the collector
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *       '404':
 *         description: No rejected requests found for the collector
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if no rejected requests were found
 *                 message:
 *                   type: string
 *                   example: No rejected requests found for the collector
 *                   description: Message indicating no rejected requests found for the collector
 *       '500':
 *         description: Error in finding rejected requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if an error occurred while finding rejected requests
 *                 message:
 *                   type: string
 *                   example: Error in finding rejected requests
 *                   description: Error message indicating the failure to find rejected requests
 */

router.get(
  "/getCountForRejectedRequest/:collectorId",
  countRejectedRequestsController
);
/**
 * @swagger
 * /api/v1/collector/getCountForAccepctedRequest/{collectorId}:
 *   get:
 *     summary: Count accepted requests for a collector
 *     description: Retrieve the count and details of accepted requests associated with a collector
 *     tags:
 *       - Collector
 *     parameters:
 *       - name: collectorId
 *         in: path
 *         required: true
 *         description: ID of the collector to retrieve accepted requests count
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Accepted requests count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accepctCount:
 *                   type: integer
 *                   example: 5
 *                   description: Number of accepted requests associated with the collector
 *                 accepct:
 *                   type: array
 *                   description: List of accepted requests associated with the collector
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *       '404':
 *         description: No accepted requests found for the collector
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if no accepted requests were found
 *                 message:
 *                   type: string
 *                   example: No accepted requests found for the collector
 *                   description: Message indicating no accepted requests found for the collector
 *       '500':
 *         description: Error in finding accepted requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if an error occurred while finding accepted requests
 *                 message:
 *                   type: string
 *                   example: Error in finding accepted requests
 *                   description: Error message indicating the failure to find accepted requests
 */

router.get(
  "/getCountForAccepctedRequest/:collectorId",
  countAccepctedRequestsController
);
/**
 * @swagger
 * /api/v1/collector/recent-request/{collectorId}:
 *   get:
 *     summary: Get the most recent request for a collector
 *     description: Retrieve the most recent request associated with a collector
 *     tags:
 *       - Collector
 *     parameters:
 *       - name: collectorId
 *         in: path
 *         required: true
 *         description: ID of the collector to retrieve the most recent request
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Most recent request found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates if the request was successful
 *                 recentRequest:
 *                   $ref: '#/components/schemas/Request'
 *                   description: Details of the most recent request associated with the collector
 *       '404':
 *         description: No recent request found for the collector
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if no recent request was found
 *                 message:
 *                   type: string
 *                   example: No recent request found for the collector
 *                   description: Message indicating no recent request found for the collector
 *       '500':
 *         description: Error finding recent request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                   description: Indicates if an error occurred while finding the recent request
 *                 message:
 *                   type: string
 *                   example: Error finding recent request
 *                   description: Error message indicating the failure to find the recent request
 */

router.get("/recent-request/:collectorId", recentRequestController);

module.exports = router;
