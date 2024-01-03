const express = require("express");
const {
  signupCollectorController,
  loginCollectorController,
  updateCollectorController,
  deleteCollectorController,
  updateLocationController,
  updateOnlineAndOfflineStatusController,
  uploadProfileImage,
  uploadCertificates,
  countRequestsForCollectorController,
  countPendingRequestsController,
  countRejectedRequestsController,
  countAccepctedRequestsController,
  recentRequestController,
  testController
} = require("../controller/collectorController");
const {requireSignIn,verifyCollectorStatus} =require("../middleware/authMiddleware")
const router = express.Router();

router.post("/signup", signupCollectorController);
router.post("/login",verifyCollectorStatus, loginCollectorController);
router.put("/update/:collectorId", updateCollectorController);
router.delete("/delete/:collectorId", deleteCollectorController);
router.put("/update-location/:collectorId", updateLocationController);
router.put("/update-status/:collectorId", updateOnlineAndOfflineStatusController);
router.post("/upload-profile-image/:collectorId", uploadProfileImage);
router.post("/upload-certificates-image/:collectorId", uploadCertificates);
router.get("/getCountForRequest/:collectorId",countRequestsForCollectorController)
router.get("/getCountForPendingRequest/:collectorId",countPendingRequestsController)
router.get("/getCountForRejectedRequest/:collectorId",countRejectedRequestsController)
router.get("/getCountForAccepctedRequest/:collectorId",countAccepctedRequestsController)
router.get("/recent-request/:collectorId",recentRequestController)
router.get("/test",requireSignIn,testController)

module.exports = router;
