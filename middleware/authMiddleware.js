const JWT = require("jsonwebtoken");
const Collector = require('../model/collectorModel'); 
const requireSignIn = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const verifyCollectorStatus = async (req, res, next) => {
  try {
    // Assuming you have the collector's ID or some identifier in req.user.id after authentication
    const collector = await Collector.findById(req.user.id);

    if (!collector) {
      return res.status(404).json({ success: false, message: 'Collector not found' });
    }

    if (collector.verificationStatus !== 'Accepted') {
      return res.status(403).json({ success: false, message: 'Collector verification status is not accepted' });
    }

    // If verificationStatus is 'Accepted', proceed to the next middleware or controller
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error verifying collector status' });
  }
};

module.exports = { requireSignIn,verifyCollectorStatus };
