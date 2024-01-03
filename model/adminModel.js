const mongoose = require("mongoose");

// Define Collector Schema
const adminSchema = new mongoose.Schema(
  {
    profileImage: {
      data: Buffer, // Store image data as a Buffer
      contentType: String, // Store the image content type
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },  
    password: {
      type: String,
      required: true,
    }, 
},
  {
    timestamps: true, 
  }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
