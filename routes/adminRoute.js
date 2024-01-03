const express = require("express");
const Admin=require("../model/adminModel")
const {
  loginAdminController,
  verifyCollectorController,
  getAllUsersController,
  getSpecficUserController,
  getAllCollectorsController,
  getSpecficCollectorController,
  getAllPendingCollectorsCollectors,
  getAllRejectedCollectorsCollectors,
  getAllAccepctedCollectorsCollectors,
  notificationToAllUsersController,
  notificationToAllCollectorController,
  notificationToAllController,
  notificationToSpecficPersonController
} = require("../controller/adminController");

const router = express.Router();

router.post("/login",loginAdminController)

/**
 *  @swagger
 *  tags:
 *    name: Admin
 *    description: Admin apis
 */

/**
 * @swagger
 *
 * /api/v1/admin/verify-collector/{collectorId}:
 *   patch:
 *     summary: Update Collector's Verification Status
 *     tags: [Admin]
 *     description: Update the verification status of a collector.
 *     parameters:
 *       - in: path
 *         name: collectorId
 *         required: true
 *         description: ID of the collector to update
 *         schema:
 *           type: string
 *         example: 12345abcdef
 *       - in: body
 *         name: collectorVerification
 *         description: Collector Verification Status
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             verificationStatus:
 *               type: string
 *               description: New verification status (Accepted/Rejected/Pending)
 *               example: Accepted
 *     responses:
 *       '200':
 *         description: Collector's Verification status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Informational message
 *                   example: Collector's Verification status updated successfully
 *                 updatedCollector:
 *                   $ref: '#/components/schemas/Collector'
 *       '400':
 *         description: Bad request, missing required data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Collector not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * components:
 *   schemas:
 *     Collector:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the collector
 *           example: 12345abcdef
 *         # Add other properties of the collector here
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error updating Verification status
 */

router.put("/verify-collector/:collectorId", verifyCollectorController);
/**
 * @swagger
 *
 * /api/v1/admin/allUsers:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     description: Retrieve all users from the database.
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 users:
 *                   type: array
 *                   description: List of users
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       '404':
 *         description: No users found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the user
 *           example: 12345abcdef
 *         name:
 *           type: string
 *           description: Name of the user
 *           example: John Doe
 *         email:
 *           type: string
 *           description: Email of the user
 *           example: john@example.com
 *         # Add other properties of the user here
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error fetching users
 */

router.get("/allUsers", getAllUsersController);
/**
 * @swagger
 *
 * /api/v1/admin/user/{userId}:
 *   get:
 *     summary: Get a specific user by ID
 *     tags: [Admin]
 *     description: Retrieve a specific user from the database by their ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *         example: 12345abcdef
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Informational message
 *                   example: User found
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the user
 *           example: 12345abcdef
 *         name:
 *           type: string
 *           description: Name of the user
 *           example: John Doe
 *         email:
 *           type: string
 *           description: Email of the user
 *           example: john@example.com
 *         # Add other properties of the user here
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error retrieving user
 */

router.get("/user/:userId", getSpecficUserController);
/**
 * @swagger
 *
 * /api/v1/admin/allCollectors:
 *   get:
 *     summary: Get all collectors
 *     tags: [Admin]
 *     description: Retrieve all collectors present in the database.
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 collectors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Collector'
 *       '404':
 *         description: No collectors found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * components:
 *   schemas:
 *     Collector:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the collector
 *           example: 12345abcdef
 *         name:
 *           type: string
 *           description: Name of the collector
 *           example: Collector 1
 *         # Add other properties of the collector here
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error fetching collectors
 */

router.get("/allCollectors", getAllCollectorsController);
/**
 * @swagger
 *
 * /api/v1/admin/collector/getAllPendingCollectors:
 *   get:
 *     summary: Get all collectors with pending verification status
 *     tags: [Admin]
 *     description: Retrieves all collectors with pending verification status.
 *     responses:
 *       '200':
 *         description: List of collectors with pending verification status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 pendingCollectors:
 *                   type: array
 *                   description: List of collectors with pending status
 *                   items:
 *                     $ref: '#/components/schemas/Collector'
 *       '404':
 *         description: No collectors with pending verification status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * components:
 *   schemas:
 *     Collector:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the collector
 *           example: 12345abcdef
 *         # Add other properties of the collector here
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: No collectors with pending verification status
 */

router.get("/collector/getAllPendingCollectors",getAllPendingCollectorsCollectors)
/**
 * @swagger
 *
 * /api/v1/admin/collector/getAllRejectedCollectors:
 *   get:
 *     summary: Get all collectors with rejected verification status
 *     tags: [Admin]
 *     description: Retrieves all collectors with rejected verification status.
 *     responses:
 *       '200':
 *         description: List of collectors with rejected verification status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 rejectedCollectors:
 *                   type: array
 *                   description: List of collectors with rejected status
 *                   items:
 *                     $ref: '#/components/schemas/Collector'
 *       '404':
 *         description: No collectors with rejected verification status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * components:
 *   schemas:
 *     Collector:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the collector
 *           example: 12345abcdef
 *         #Add other properties of the collector here
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: No collectors with rejected verification status
 */

router.get("/collector/getAllRejectedCollectors",getAllRejectedCollectorsCollectors)
/**
 * @swagger
 *
 * /api/v1/admin/collector/getAllAccepctedCollectors:
 *   get:
 *     summary: Get all collectors with accepted verification status
 *     tags: [Admin]
 *     description: Retrieves all collectors with accepted verification status.
 *     responses:
 *       '200':
 *         description: List of collectors with accepted verification status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 accepctedCollectors:
 *                   type: array
 *                   description: List of collectors with accepted status
 *                   items:
 *                     $ref: '#/components/schemas/Collector'
 *       '404':
 *         description: No collectors with accepted verification status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * components:
 *   schemas:
 *     Collector:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the collector
 *           example: 12345abcdef
 *         # Add other properties of the collector here
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: No collectors with accepted verification status
 */

router.get("/collector/getAllAccepctedCollectors",getAllAccepctedCollectorsCollectors)
/**
 * @swagger
 *
 * /api/v1/admin/collector/{collectorId}:
 *   get:
 *     summary: Get specific collector by ID
 *     tags: [Admin] 
 *     description: Retrieve information about a specific collector by their ID.
 *     parameters:
 *       - in: path
 *         name: collectorId
 *         required: true
 *         description: ID of the collector to retrieve
 *         schema:
 *           type: string
 *         example: 12345abcdef
 *     responses:
 *       '200':
 *         description: Collector information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Informational message
 *                   example: Collector found
 *                 collector:
 *                   $ref: '#/components/schemas/Collector'
 *       '404':
 *         description: Collector not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the failure status of the operation
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Error message indicating collector not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the failure status of the operation
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating an internal server error
 * components:
 *   schemas:
 *     Collector:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the collector
 *           example: 12345abcdef
 *         # Add other properties of the collector here
 */

router.get("/collector/:collectorId", getSpecficCollectorController);
/**
 * @swagger
 *
 * /api/v1/admin/user/notifyAllUsers:
 *   post:
 *     summary: Send notification to all users
 *     tags: [Admin]
 *     description: Sends a notification to all users with the specified title and body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the notification.
 *               body:
 *                 type: string
 *                 description: Body content of the notification.
 *     responses:
 *       '200':
 *         description: Notifications sent successfully to all users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the success status of the operation.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Message indicating the result of the operation.
 *                   example: Notifications sent successfully to all users
 *                 response:
 *                   type: object
 *                   description: Response from the notification service (optional).
 *       '400':
 *         description: Bad request, missing required data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the failure status of the operation.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating missing fields.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the failure status of the operation.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating an internal server error.
 */

router.post("/user/notifyAllUsers", notificationToAllUsersController);
/**
 * @swagger
 *
 * /api/v1/admin//collector/notifyAllCollectors:
 *   post:
 *     summary: Send notifications to all collectors
 *     tags: [Admin]
 *     description: Send push notifications to all collectors registered in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the notification.
 *               body:
 *                 type: string
 *                 description: Body content of the notification.
 *     responses:
 *       '200':
 *         description: Notifications sent successfully to all collectors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Informational message
 *                   example: Notifications sent successfully to all Collectors
 *                 response:
 *                   type: object
 *                   description: Response from the notification sending process
 *       '400':
 *         description: Bad request, missing required data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error in sending notifications to all Collectors
 */

router.post("/collector/notifyAllCollectors", notificationToAllCollectorController);
/**
 * @swagger
 *
 * /api/v1/admin/all/notifyAll:
 *   post:
 *     summary: Send notifications to all users and collectors
 *     tags: [Admin]
 *     description: Send push notifications to all users and collectors in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the notification.
 *               body:
 *                 type: string
 *                 description: Body content of the notification.
 *     responses:
 *       '200':
 *         description: Notifications sent successfully to all users and collectors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Informational message
 *                   example: Notifications sent successfully to all
 *                 response:
 *                   type: object
 *                   description: Response from the notification sending process
 *       '400':
 *         description: Bad request, missing required data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error in sending notifications to all
 */

router.post("/all/notifyAll", notificationToAllController);

/**
 * @swagger
 *
 * /api/v1/admin//person/notify:
 *   post:
 *     summary: Send notification to a specific person
 *     tags: [Admin]
 *     description: Send push notification to a specific person using their FCM token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the notification.
 *               body:
 *                 type: string
 *                 description: Body content of the notification.
 *               fcmToken:
 *                 type: string
 *                 description: FCM token of the recipient.
 *     responses:
 *       '200':
 *         description: Notification sent successfully to the specific person
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Informational message
 *                   example: Notification sent successfully to the person
 *                 response:
 *                   type: object
 *                   description: Response from the notification sending process
 *       '400':
 *         description: Bad request, missing required data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error in sending notification to the person
 */

router.post("/person/notify", notificationToSpecficPersonController);
module.exports = router;
