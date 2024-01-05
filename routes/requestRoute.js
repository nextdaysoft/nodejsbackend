const express = require("express");
const router = express.Router();
const {
  updateRequestStatusController,
  deleteRequestController,
  findPendingRequestController,
  findAcceptedRequestController,
  findRejectedRequestController,
  checkRequestStatusController,
  updatePaymentMethodController,
  getAllRequestController,
  getAllRequestWithStatus,
  getTopBookedCollectorsController,
  getTotalSalesController,
  getTopBookedTestsController
} = require("../controller/requestController");

/**
 * @swagger
 * components:
 *  schemas:
 *    Request:
 *      type: object
 *      properties:
 *        userId:
 *          type: string
 *          description: ID of the associated user
 *          example: 61ff1f979b6b77a8f081ea91
 *        testids:
 *          type: array
 *          items:
 *            type: string
 *          description: Array of test IDs
 *          example:
 *            - testId1
 *            - testId2
 *        collectorId:
 *          type: string
 *          description: ID of the associated collector
 *          example: 61ff1f979b6b77a8f081ea92
 *        status:
 *          type: string
 *          enum:
 *            - Pending
 *            - Accepted
 *            - Test Started
 *            - Rejected
 *            - Test Completed
 *          description: Status of the request
 *          example: Pending
 *        paymentMethod:
 *          type: string
 *          description: Payment method used
 *          example: Credit Card
 *        totalAmount:
 *          type: number
 *          description: Total amount associated with the request
 *          example: 100.50
 *        createdAt:
 *          type: string
 *          format: date-time
 *          description: Date and time when the request was created
 *          example: "2023-12-15T09:27:00Z"
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          description: Date and time when the request was last updated
 *          example: "2023-12-16T15:45:00Z"
 *      required:
 *        - userId
 *        - testids
 *        - paymentMethod
 */
/**
 *  @swagger
 *  tags:
 *    name: Request
 *    description: Request apis
 */
/**
 * @swagger
 * /api/v1/request/update-status/{requestId}:
 *   put:
 *     summary: Update request status
 *     description: Update the status of a request by its ID
 *     tags:
 *       - Request
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the request to update
 *       - in: body
 *         name: requestBody
 *         required: true
 *         description: Request body containing newStatus and fcmToken
 *         schema:
 *           type: object
 *           required:
 *             - newStatus
 *           properties:
 *             newStatus:
 *               type: string
 *               enum:
 *                 - Pending
 *                 - Accepted
 *                 - Test Started
 *                 - Rejected
 *                 - Test completed
 *               description: New status for the request
 *             fcmToken:
 *               type: string
 *               description: Firebase Cloud Messaging token
 *     responses:
 *       '200':
 *         description: Request status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Message indicating the status of the operation
 *                   example: Request status updated successfully
 *                 updatedRequest:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       description: ID of the associated user
 *                       example: 61ff1f979b6b77a8f081ea91
 *                     testids:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array of test IDs
 *                       example:
 *                         - testId1
 *                         - testId2
 *                     collectorId:
 *                       type: string
 *                       description: ID of the associated collector
 *                       example: 61ff1f979b6b77a8f081ea92
 *                     status:
 *                       type: string
 *                       description: Status of the request
 *                       example: Accepted
 *                     paymentMethod:
 *                       type: string
 *                       description: Payment method used
 *                       example: Credit Card
 *                     totalAmount:
 *                       type: number
 *                       description: Total amount associated with the request
 *                       example: 100.50
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date and time when the request was created
 *                       example: "2023-12-15T09:27:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date and time when the request was last updated
 *                       example: "2023-12-16T15:45:00Z"
 *       '400':
 *         description: Missing required data or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating missing data or invalid request
 *                   example: Missing required data
 *       '404':
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the request was not found
 *                   example: Request not found
 *       '500':
 *         description: Error updating request status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating failure in updating request status
 *                   example: Error updating request status
 */

router.put("/update-status/:requestId", updateRequestStatusController);
/**
 * @swagger
 * /api/v1/request/update-paymentMethod/{requestId}:
 *   put:
 *     summary: Update payment method of a request by ID
 *     description: Update the payment method of a request based on its ID
 *     tags:
 *       - Request
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         description: ID of the request to update payment method
 *         schema:
 *           type: string
 *         example: 61ff1f979b6b77a8f081ea91
 *       - in: body
 *         name: body
 *         description: Payment method data for the request
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             paymentMethod:
 *               type: string
 *               description: New payment method to be updated
 *               example: Credit Card
 *     responses:
 *       '200':
 *         description: Payment method updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message indicating payment method update
 *                   example: Payment method updated successfully
 *                 request:
 *                   $ref: '#/components/schemas/Request'
 *       '404':
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating request not found
 *                   example: Request not found
 *       '500':
 *         description: Error updating payment method
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error message indicating failure to update payment method
 *                   example: Error updating payment method
 */

router.put("/update-paymentMethod/:requestId", updatePaymentMethodController);

/**
 * @swagger
 * /api/v1/request/delete-request/{requestId}:
 *   delete:
 *     summary: Delete a request by ID
 *     description: Delete a request based on its ID
 *     tags:
 *       - Request
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         description: ID of the request to be deleted
 *         schema:
 *           type: string
 *         example: 61ff1f979b6b77a8f081ea91
 *     responses:
 *       '200':
 *         description: Request deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message indicating request deletion
 *                   example: Request deleted successfully
 *       '400':
 *         description: Request ID is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating missing request ID
 *                   example: Request ID is missing
 *       '404':
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating request not found
 *                   example: Request not found
 *       '500':
 *         description: Error deleting request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating failure to delete request
 *                   example: Error deleting request
 */

router.delete("/delete-request/:requestId", deleteRequestController);
/**
 * @swagger
 * /api/v1/request/getAllRequest:
 *   get:
 *     summary: Get all requests with details
 *     description: Retrieve all requests along with associated test, user, and collector details
 *     tags:
 *       - Request
 *     responses:
 *       '200':
 *         description: All requests with associated details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                   example: true
 *                 requestsWithDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID of the request
 *                         example: 61ff1f979b6b77a8f081ea91
 *                       userId:
 *                         type: string
 *                         description: ID of the associated user
 *                         example: 61ff1f979b6b77a8f081ea92
 *                       testids:
 *                         type: array
 *                         items:
 *                           type: string
 *                           description: Array of test IDs associated with the request
 *                           example:
 *                             - testId1
 *                             - testId2
 *                       status:
 *                         type: string
 *                         description: Status of the request
 *                         example: Pending
 *                       paymentMethod:
 *                         type: string
 *                         description: Payment method used
 *                         example: Credit Card
 *                       totalAmount:
 *                         type: number
 *                         description: Total amount associated with the request
 *                         example: 100.50
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time when the request was created
 *                         example: "2023-12-15T09:27:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time when the request was last updated
 *                         example: "2023-12-16T15:45:00Z"
 *                       testNames:
 *                         type: array
 *                         items:
 *                           type: string
 *                           description: Array of test names associated with the request
 *                           example:
 *                             - Test 1
 *                             - Test 2
 *                       userName:
 *                         type: string
 *                         description: Name of the associated user
 *                         example: John Doe
 *                       collectorName:
 *                         type: string
 *                         description: Name of the associated collector
 *                         example: Jane Smith
 *       '500':
 *         description: Failed to fetch all requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating failure to fetch all requests
 *                   example: Failed to fetch all requests
 */

router.get("/getAllRequest", getAllRequestController);
/**
 * @swagger
 * /api/v1/request/pending-request:
 *   get:
 *     summary: Find pending requests
 *     description: Retrieve a list of pending requests
 *     tags:
 *       - Request
 *     responses:
 *       '200':
 *         description: A list of pending requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                   example: true
 *                 pendingRequests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *                   description: List of pending requests
 *       '500':
 *         description: Failed to fetch pending requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating failure to fetch pending requests
 *                   example: Failed to fetch pending requests
 */

router.get("/pending-request", findPendingRequestController);
/**
 * @swagger
 * /api/v1/request/accepted-request:
 *   get:
 *     summary: Get accepted requests
 *     description: Retrieve all requests with status 'Accepted'
 *     tags:
 *       - Request
 *     responses:
 *       '200':
 *         description: Accepted requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                   example: true
 *                 acceptedRequests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *                   description: List of requests with status 'Accepted'
 *       '500':
 *         description: Failed to fetch accepted requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating failure to fetch accepted requests
 *                   example: Failed to fetch accepted requests
 */
router.get("/accepted-request", findAcceptedRequestController);
/**
 * @swagger
 * /api/v1/request/rejected-request:
 *   get:
 *     summary: Find rejected requests
 *     description: Retrieve a list of rejected requests
 *     tags:
 *       - Request
 *     responses:
 *       '200':
 *         description: A list of rejected requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                   example: true
 *                 rejectedRequests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *                   description: List of rejected requests
 *       '500':
 *         description: Failed to fetch rejected requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating failure to fetch rejected requests
 *                   example: Failed to fetch rejected requests
 */

router.get("/rejected-request", findRejectedRequestController);
/**
 * @swagger
 * /api/v1/request/getAllRequestWithStatus:
 *   get:
 *     summary: Get count of requests with different statuses
 *     description: Retrieve the count of requests based on different statuses (Pending, Accepted, Rejected)
 *     tags:
 *       - Request
 *     responses:
 *       '200':
 *         description: Counts of requests with different statuses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                   example: true
 *                 pendingRequests:
 *                   type: number
 *                   description: Number of requests with status 'Pending'
 *                   example: 5
 *                 acceptedRequests:
 *                   type: number
 *                   description: Number of requests with status 'Accepted'
 *                   example: 10
 *                 rejectedRequests:
 *                   type: number
 *                   description: Number of requests with status 'Rejected'
 *                   example: 3
 *       '500':
 *         description: Failed to fetch request counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating failure to fetch request counts
 *                   example: Failed to fetch request counts
 */

router.get("/getAllRequestWithStatus", getAllRequestWithStatus);
/**
 * @swagger
 * /api/v1/request/request-status/{requestId}:
 *   get:
 *     summary: Check status of a request by ID
 *     description: Retrieve the status of a request based on its ID
 *     tags:
 *       - Request
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         description: ID of the request to check status
 *         schema:
 *           type: string
 *         example: 61ff1f979b6b77a8f081ea91
 *     responses:
 *       '200':
 *         description: Request status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                   example: true
 *                 request:
 *                   $ref: '#/components/schemas/Request'
 *       '404':
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating request not found
 *                   example: Request not found
 *       '500':
 *         description: Error checking request status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating failure to check request status
 *                   example: Error checking request status
 */

router.get("/request-status/:requestId", checkRequestStatusController);
/**
 * @swagger
 * /api/v1/request/getTopBookedCollectors:
 *   get:
 *     summary: Get top booked collectors
 *     description: Retrieve the top 5 most booked collectors
 *     tags:
 *       - Request
 *     responses:
 *       '200':
 *         description: Top booked collectors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                   example: true
 *                 topBookedCollectors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       collectorId:
 *                         type: string
 *                         description: ID of the collector
 *                         example: 61ff1f979b6b77a8f081ea92
 *                       count:
 *                         type: number
 *                         description: Number of requests booked for the collector
 *                         example: 10
 *                       collectorInfo:
 *                         $ref: '#/components/schemas/Collector' # Reference to Collector schema
 *       '500':
 *         description: Error retrieving top booked collectors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message indicating failure to retrieve top booked collectors
 *                   example: Error retrieving top booked collectors
 */

router.get("/getTopBookedCollectors", getTopBookedCollectorsController);
router.get("/getTopBookedTests",getTopBookedTestsController)
router.get("/getTotalSales", getTotalSalesController);

module.exports = router;
