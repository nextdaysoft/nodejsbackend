const multer = require('multer');

// Set storage and file handling options for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the destination folder where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Set the filename (can be customized as per your requirement)
  }
});

// Create the Multer instance with configuration
const upload = multer({ storage: storage });
