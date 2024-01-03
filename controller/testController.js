const Test = require("../model/testModel");

const createTestController = async (req, res) => {
  try {
    const { testName, price, testCode } = req.body;

    // Check if testCode already exists
    const existingTest = await Test.findOne({ testCode });
    if (existingTest) {
      return res
        .status(400)
        .json({ success: false, message: "Test code already exists" });
    }

    // Create a new test
    const test = new Test({ testName, price, testCode });
    await test.save();

    res
      .status(201)
      .json({ success: true, message: "Test created successfully", test });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in creating test" });
  }
};
const updateTestController = async (req, res) => {
  try {
    const { testCode } = req.params;
    const { testName, price } = req.body;

    // Find the test by testCode
    let test = await Test.findOne({ testCode });

    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    // Update test fields if provided in request body
    if (testName) {
      test.testName = testName;
    }
    if (price) {
      test.price = price;
    }

    // Save the updated test
    test = await test.save();

    res
      .status(200)
      .json({ success: true, message: "Test updated successfully", test });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in updating test" });
  }
};
const getAllTestController = async (req, res) => {
  try {
    // Fetch all tests
    const tests = await Test.find({}, "testName price testCode"); // Retrieve only necessary fields

    res.status(200).json({ success: true, tests });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error in fetching tests" });
  }
};
const deleteTestController = async (req, res) => {
  try {
    const { testCode } = req.params;

    // Find the test by testCode and delete it
    const deletedTest = await Test.findOneAndDelete({ testCode });

    if (!deletedTest) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    res.status(200).json({
      success: true,
      message: "Test deleted successfully",
      deletedTest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in deleting test" });
  }
};
module.exports = {
  createTestController,
  updateTestController,
  getAllTestController,
  deleteTestController,
};
