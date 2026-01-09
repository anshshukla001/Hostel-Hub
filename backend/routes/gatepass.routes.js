const express = require("express");
const {
  gatePassEntry,
  getAllGatepass,
  gatePassEdit,
  fetchHostelGatepasses,
  approveGatepass,
  rejectGatepass,
  searchGatepasses,
} = require("../controllers/gatepass.controllers.js");

const router = express.Router();

router.post("/apply", gatePassEntry);
router.patch("/apply", gatePassEdit);
router.get("/all", getAllGatepass);

router.route("/warden/gatepass/:hostel").get(fetchHostelGatepasses);

router.put("/warden/approve/:gatepassId",approveGatepass);
router.put("/warden/reject/:gatepassId",rejectGatepass);

router.get('/search', searchGatepasses);

module.exports = router;
