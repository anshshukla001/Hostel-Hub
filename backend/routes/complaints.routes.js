const express = require("express");
const {
  raiseComplaint,
  getComplaintsByUser,
  getComplaintsByHostel,
  handleResolve,
  handleDismiss,
  searchComplaints,
} = require("../controllers/complaints.controllers.js");

const router = express.Router();

router.post("/raise", raiseComplaint);

router.get("/getByUser", getComplaintsByUser);

router.get("/getByHostel", getComplaintsByHostel);

router.put("/warden/resolve/:complaintID", handleResolve);

router.put("/warden/dismiss/:complaintID", handleDismiss);

router.get("/search", searchComplaints);

module.exports = router;
