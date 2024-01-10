// userRoutes.js

const express = require("express");
const {
  signupUserController,
  verifyOtpUserController,
  deleteUserController,
  updateUserController,
  createRequestController,
  updateNotificationStatusController,
  uploadProfileImage,
} = require("../controller/userController");
const User=require('../model/userModel')
const router = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - number
 *      properties:
 *        id:
 *          type: string
 *          description: The Auto-generated id of user collection
 *          example: DHSASDHJDJHVAJDSVJAVSD
 *        name:
 *          type: string
 *          description: User name
 *        email:
 *          type: string
 *          description: user email address
 *        number:
 *          type: string
 *          description: user mobile number
 *        alternateNumber:
 *          type: string
 *          description: user alternate mobile number
 *        note:
 *          type: string
 *          description: user note
 *      example:
 *        id: GDHJGD788BJBJ
 *        name: John
 *        email: johndoes@gmail.com
 *        number: '8787878787'
 *        alternateNumber: '8787878786'
 *        note: 'this is a great user'
 */
/**
 *  @swagger
 *  tags:
 *    name: User
 *    description: User apis
 */

/**
 * @swagger
 * /api/v1/user/signup:
 *    post:
 *      summary: register new user
 *      tags: [User]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: Otp send successfully!
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        500:
 *          description: Internal Server Error
 */

router.post("/signup", signupUserController); // Assuming this is a GET request for displaying a signup form, adjust as needed
/**
 * @swagger
 * /api/v1/user/signup/verify:
 *    post:
 *      summary: Verify user OTP and register user
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                number:
 *                  type: string
 *                  description: User's phone number for OTP verification
 *                otp:
 *                  type: string
 *                  description: User's OTP for verification
 *              required:
 *                - number
 *                - otp
 *      responses:
 *        '200':
 *          description: User registration successful
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: Success message
 *                  token:
 *                    type: string
 *                    description: JWT token for authenticated user
 *                  data:
 *                    type: object
 *                    description: Registered user data
 *        '400':
 *          description: Error response
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                description: Error message (e.g., expired OTP or wrong OTP)
 */
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
router.post("/signup/verify", verifyOtpUserController);
/**
 * @swagger
 * /api/v1/user/update/{userId}:
 *    put:
 *      summary: Update user information
 *      tags: [User]
 *      parameters:
 *        - in: path
 *          name: userId
 *          required: true
 *          description: ID of the user to update
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  description: User's name
 *                email:
 *                  type: string
 *                  description: User's email
 *                number:
 *                  type: string
 *                  description: User's number
 *                alternateNumber:
 *                  type: string
 *                  description: User's alternate number
 *                note:
 *                  type: string
 *                  description: Additional note about the user
 *              required:
 *                - userId
 *                - name
 *                - email
 *                - number
 *      responses:
 *        '200':
 *          description: User updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: Indicates if the operation was successful
 *                  message:
 *                    type: string
 *                    description: Success message
 *                  user:
 *                    $ref: '#/components/schemas/User'
 *        '400':
 *          description: Error response
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: Indicates if the operation failed
 *                  error:
 *                    type: string
 *                    description: Error message
 *                  message:
 *                    type: string
 *                    description: Error details
 */

router.put("/update/:userId", upload.single("profileImage"),async (req,res)=>{
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
    const uploadedFile = req.file;
    if (!uploadedFile ) {
      return res.status(400).send("No files were uploaded.");
    }
    const imageUrl=`https://nodejs-app-ddkb.onrender.com/${uploadedFile.path}`
    user.profileImage = imageUrl;

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
});
/**
 * @swagger
 * /api/v1/user/delete/{userId}:
 *    delete:
 *      summary: Delete a user
 *      tags: [User]
 *      parameters:
 *        - in: path
 *          name: userId
 *          required: true
 *          description: ID of the user to delete
 *          schema:
 *            type: string
 *      responses:
 *        '200':
 *          description: User deleted successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: Deletion success message
 *        '404':
 *          description: Error response
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    description: Error message (User not found)
 *        '500':
 *          description: Error response
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    description: Error message (An error occurred while deleting the user)
 */

router.delete("/delete/:userId", deleteUserController);
/**
 * @swagger
 * /api/v1/user/book-test:
 *   post:
 *     summary: Create a new test request
 *     description: Endpoint to create a new test request and send it to nearby collectors
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Identifier of the user making the test request
 *               testids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of test identifiers to be performed
 *               quantities:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of quantities corresponding to each test
 *               location:
 *                 type: object
 *                 properties:
 *                   longitude:
 *                     type: number
 *                     format: float
 *                     description: Longitude coordinate of the location
 *                   latitude:
 *                     type: number
 *                     format: float
 *                     description: Latitude coordinate of the location
 *                 description: Object containing the coordinates of the location
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method for the test request
 *     responses:
 *       201:
 *         description: Collector booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful or not
 *                 message:
 *                   type: string
 *                   description: Description/message regarding the success
 *                 collector:
 *                   type: object
 *                   description: Details of the booked collector
 *                 request:
 *                   type: object
 *                   description: Details of the created request
 *       400:
 *         description: All collectors rejected the request or bad request due to missing data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request failed
 *                 message:
 *                   type: string
 *                   description: Description/message regarding the failure
 *       404:
 *         description: No available collector found for selected tests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request failed due to no available collectors
 *                 message:
 *                   type: string
 *                   description: Description/message regarding the failure
 *       500:
 *         description: Error handling for internal server errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request failed due to an internal server error
 *                 message:
 *                   type: string
 *                   description: Description/message regarding the failure
 */

router.post("/book-test", createRequestController);
/**
 * @swagger
 * /api/v1/user/update-notificationStatus/{userId}:
 *   patch:
 *     summary: Update notification status for a user
 *     description: Update the notification status field for a specific user identified by userId
 *     tags:
 *       - User
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to update notification status
 *         schema:
 *           type: string
 *       - name: notificationStatus
 *         in: body
 *         description: Object containing the notification status to be updated
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             notificationStatus:
 *               type: string
 *               description: Updated notification status for the user
 *     responses:
 *       200:
 *         description: Notification status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the notification status was updated successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                   description: Updated user object
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates that the user was not found
 *                 message:
 *                   type: string
 *                   description: Message indicating user not found
 *       500:
 *         description: Failed to update notification status due to internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates that updating notification status failed
 *                 message:
 *                   type: string
 *                   description: Message indicating failure to update notification status
 */
router.put(
  "/update-notificationStatus/:userId",
  updateNotificationStatusController
);
/**
 * @swagger
 * /api/v1/user/upload-profile-image/{userId}:
 *   post:
 *     summary: Upload profile image for a user
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to update profile image
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
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                   description: User with updated profile image
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *                   description: Error message indicating the user was not found
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

router.post("/upload-profile-image/:userId", uploadProfileImage);

module.exports = router;
