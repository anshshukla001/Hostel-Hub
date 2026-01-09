const express = require("express");

const {getHostelStats} = require("../controllers/admin.controllers.js");

const router = express.Router();

router.get("/hostel-stats",getHostelStats);

module.exports = router;