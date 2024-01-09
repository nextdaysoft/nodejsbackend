const mongoose = require("mongoose");

// Define Collector Schema
const collectorSchema = new mongoose.Schema(
  {
    profileImage: {
      data: Buffer, // Store image data as a Buffer
      contentType: String, // Store the image content type
    },
    certificates: [{
      type: String, // Store image URLs as strings
    }],
    fullName: {
      type: String,
     
    },
    companyName: {
      type: String,
   
    },
    phoneNumber: {
      type: String,
    
    },
    email: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
     
    },
    password: {
      type: String,
      
    },
    
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
     
    },
    selectedTests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test", // Refers to the collection name where test IDs are stored
      },
    ],
    yearOfExperience: {
      type: Number,
     
    },
    testNames: [
      {
        type: String,
        
      },
    ],
    // location: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //     required: true,
    //     default: "Point",
    //   },
    //   coordinates: {
    //     type: [Number],
    //     validate: {
    //       validator: function (coords) {
    //         return coords.length === 2 &&
    //           typeof coords[0] === "number" &&
    //           typeof coords[1] === "number";
    //       },
    //       message:
    //         "Invalid location coordinates. Provide both longitude and latitude as numeric values.",
    //     },
    //   },
    //},
    location: {
      type: { type: String },
      coordinates: [Number],
    },
    
    note: {
      type: String,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    fcmToken: {
      type: String,
    },
    isWorking:{
      type:Boolean,
      default:false
    },
    testRunning: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request", // Refers to the collection name where test IDs are stored
      },
    
  },
  {
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
  }
);
collectorSchema.index({ location: "2dsphere" });
const Collector = mongoose.model("Collector", collectorSchema);

module.exports = Collector;
