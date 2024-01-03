// testModel.js
const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
    default: "Other",
  },
  price: {
    type: Number,
    required: true,
  },
  testCode: {
    type: String,
    unique: true,
    required: true,
  },
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
