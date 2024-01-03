const express = require("express");
const router = express.Router();
const {
  updateTestController,
  createTestController,
  getAllTestController,
  deleteTestController,
} = require("../controller/testController");

/**
 * @swagger
 * components:
 *  schemas:
 *    Test:
 *      type: object
 *      required:
 *        - testName
 *        - price
 *        - testCode
 *      properties:
 *        id:
 *          type: string
 *          description: The Auto-generated id of user collection
 *          example: DHSASDHJDJHVAJDSVJAVSD
 *        testName:
 *          type: string
 *          description: test name
 *        price:
 *          type: string
 *          description: price of the test
 *        testCode:
 *          type: string
 *          description: unique test code
 *  
 *      example:
 *        id: GDHJGD788BJBJ
 *        testName: covid test
 *        price: $20
 *        testCode: hbc256
 
 */

/**
 *  @swagger
 *  tags:
 *    name: Test
 *    description: Test apis
 */

/**
 * @swagger
 * /api/v1/test/createTest:
 *   post:
 *     summary: Create a new test
 *     tags: [Test]
 *     description: Endpoint to create a new test.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               testName:
 *                 type: string
 *                 description: Name of the test.
 *               price:
 *                 type: string
 *                 description: Price of the test.
 *               testCode:
 *                 type: string
 *                 description: Unique code for the test.
 *     responses:
 *       '201':
 *         description: Test created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the success status of the operation.
 *                 message:
 *                   type: string
 *                   description: Message indicating the result of the operation.
 *                 test:
 *                   $ref: '#/components/schemas/Test'
 *       '400':
 *         description: Test code already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the failure status of the operation.
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the test code already exists.
 *       '500':
 *         description: Error in creating test.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the failure status of the operation.
 *                 message:
 *                   type: string
 *                   description: Error message indicating an internal server error.
 *                 error:
 *                   type: object
 *                   description: Additional error information (optional).
 */

router.post("/createTest", createTestController);

/**
 * @swagger
 * /api/v1/test/getAllTests:
 *   get:
 *     summary: Get all tests
 *     tags: [Test]
 *     description: Retrieve a list of all available tests.
 *     responses:
 *       '200':
 *         description: List of tests retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the success status of the operation.
 *                 tests:
 *                   type: array
 *                   description: List of tests.
 *                   items:
 *                     $ref: '#/components/schemas/Test'
 *       '500':
 *         description: Error in fetching tests.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the failure status of the operation.
 *                 message:
 *                   type: string
 *                   description: Error message indicating an internal server error.
 *                 error:
 *                   type: object
 *                   description: Additional error information (optional).
 */

router.get("/getAllTests", getAllTestController);

/**
 * @swagger
 *
 * /api/v1/test/deleteTest/{testCode}:
 *   delete:
 *     summary: Delete a test by test code
 *     tags: [Test]
 *     description: Delete a specific test based on its unique test code.
 *     parameters:
 *       - in: path
 *         name: testCode
 *         required: true
 *         description: Unique code of the test to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Test deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the success status of the operation.
 *                 message:
 *                   type: string
 *                   description: Message indicating the result of the operation.
 *                 deletedTest:
 *                   $ref: '#/components/schemas/Test'
 *       '404':
 *         description: Test not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the failure status of the operation.
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the test was not found.
 *       '500':
 *         description: Error in deleting test.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the failure status of the operation.
 *                 message:
 *                   type: string
 *                   description: Error message indicating an internal server error.
 *                 error:
 *                   type: object
 *                   description: Additional error information (optional).
 */

router.delete("/deleteTest/:testCode", deleteTestController);

/**
 * @swagger
 * /api/v1/test/updateTest/{testCode}:
 *   put:
 *     summary: Update a test by test code
 *     tags: [Test]
 *     description: Update details of a specific test based on its unique test code.
 *     parameters:
 *       - in: path
 *         name: testCode
 *         required: true
 *         description: Unique code of the test to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               testName:
 *                 type: string
 *                 description: New name for the test.
 *               price:
 *                 type: string
 *                 description: New price for the test.
 *     responses:
 *       '200':
 *         description: Test updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the success status of the operation.
 *                 message:
 *                   type: string
 *                   description: Message indicating the result of the operation.
 *                 test:
 *                   $ref: '#/components/schemas/Test'
 *       '404':
 *         description: Test not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the failure status of the operation.
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the test was not found.
 *       '500':
 *         description: Error in updating test.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the failure status of the operation.
 *                 message:
 *                   type: string
 *                   description: Error message indicating an internal server error.
 *                 error:
 *                   type: object
 *                   description: Additional error information (optional).
 */

router.put("/updateTest/:testCode", updateTestController);
module.exports = router;
