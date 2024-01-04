const mongoose = require("mongoose");
const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  testids: [
    {
      type: String,
      required: true,
    },
  ],
  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collector",
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Test Started", "Rejected", "Test completed"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  totalAmount:{
    type:Number
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
},{
  timestamps: true, // Enable timestamps (createdAt, updatedAt)
});
const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
