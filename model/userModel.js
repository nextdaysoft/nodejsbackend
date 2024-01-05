const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,      
    },
    number: {
      type: String,
     
    },
    alternateNumber: {
      type: String,
    },
    loginType: {
      type: String,
    },
    note: {
      type: String,
    },
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
    // }
    location: {
      type: { type: String },
      coordinates: [Number],
    },
    notificatioStatus: {
      type: String,
    },
    profileImage: {
      data: Buffer, // Store image data as a Buffer
      contentType: String, // Store the image content type
    },
    fcmToken: {
      type: String,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    mobileVerificationStatus: { type: Boolean },

    // Fields for Google authentication
    googleId: { type: String },

    // Fields for Facebook authentication
    facebookId: { type: String },
     // Fields for Facebook authentication
    appleId: { type: String },
  },
  { timestamps: true }
);

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      number: this.number,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
  return token;
};
userSchema.index({ location: "2dsphere" });
const User = model("User", userSchema); // Define the User model

// Drop a single index by name on the 'email' field
User.collection.dropIndex("email_1", function (err, result) {
  if (err) {
    console.error("Error dropping index:", err);
  } else {
    console.log("Index dropped successfully:", result);
  }
});


module.exports = User; // Export the User model
