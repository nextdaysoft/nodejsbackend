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
 * /verify-otp:
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

router.post("/signup/verify", verifyOtpUserController);
/**
 * @swagger
 * /update-user/{userId}:
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

router.put("/update/:userId", updateUserController);
/**
 * @swagger
 * /delete-user/{userId}:
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
router.post("/book-test", createRequestController);
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
