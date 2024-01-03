const express = require("express");
const router = express.Router();
const {
  updateRequestStatusController,
  deleteRequestController,
  findPendingRequestController,
  findAccepctedRequestController,
  findRejectedRequestController,
  checkRequestStatusController,
  updatePaymentMethodController,
  getAllRequestController,
  getAllRequestWithStatus
} = require("../controller/requestController");

router.put("/update-status/:requestId", updateRequestStatusController);
router.put("/update-paymentMethod/:requestId", updatePaymentMethodController);
router.delete("/delete-request/:requestId", deleteRequestController);
router.get("/getAllRequest", getAllRequestController);
router.get("/pending-request", findPendingRequestController);
router.get("/accepcted-request", findAccepctedRequestController);
router.get("/rejected-request", findRejectedRequestController);
router.get("/getAllRequestWithStatus", getAllRequestWithStatus);
router.get("/request-status/:requestId", checkRequestStatusController);

module.exports = router;
