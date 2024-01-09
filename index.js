// API DOcumenATion
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("swagger-jsdoc");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/connection");
const cors = require("cors");
const cookieSession = require("cookie-session");
dotenv.config();
//firebase
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const admin = require('firebase-admin');
const collectorRoute = require("./routes/controllerRoute");
const userRoute = require("./routes/userRoute");
const testRoute = require("./routes/testRoute");
const requestRoute = require("./routes/requestRoute");
const adminRoute = require("./routes/adminRoute");
const authRoute = require("./routes/authRoute");
const formidableMiddleware = require("express-formidable");
const User = require("./model/userModel");
const app = express();

connectDB();
app.use(cors())
// Swagger api config
// swagger api options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Collector Application",
      description: "Node Expressjs User Application Application",
    },
    servers: [
      {
           url: "https://famous-foal-khakis.cyclic.app"
       // url: "http://localhost:1200",
        // url: "http://192.168.1.4:1200",
        // url: "https://nodejs-job-portal-app.onrender.com"
       
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerDoc(options);
//homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));
// app.use(formidableMiddleware());
app.use(express.json()); // Place express.json() after formidableMiddleware
app.use("/api/v1/collector", collectorRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/test", testRoute);
app.use("/api/v1/request", requestRoute);
app.use("/api/v1/admin", adminRoute);




///////////////////////////////////////////////////////////////////////////////////////////////////////////
//firebase setup
process.env.GOOGLE_APPLICATION_CREDENTIALS;
app.use(
  cors({
    origin: "*",
  },),
  
);

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);


app.use(function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});
// Initialize Firebase Admin SDK
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'bussinessapp-6156a',
});


////////////////////////////////////////////////////////////////////////////////////////////////



const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;




// ... other app setup

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.CLIENT_SECRET,

    
callbackURL: 'https://bussinessapp-6156a.firebaseapp.com/__/auth/handler/auth/google/callback', // Adjust callback URL
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    User.findOne({ googleId: profile.id })
      .then((user) => {
        if (user) {
          // User found, return existing user
          return done(null, user);
        } else {
          // Create a new user
          const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value, // Assuming email is provided
            // ... other fields
          });
          return newUser.save().then((savedUser) => done(null, savedUser));
        }
      })
      .catch((err) => done(err));
  }
)
);

// Authenticate middleware
app.get('/auth/google', passport.authenticate('google'));

// Callback for Google login
app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  const token = req.user.generateJWT(); // Assuming a generateJWT method in your User model
  res.json({ token });
});


////////////////////////////////////////////////////////////////////////////////////////////

//static file

const PORT = process.env.PORT || 1200;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//home2/nextdyoo/nodejsapp.nextdaysoft.com