const Gatepass = require("../models/gatepass.models.js");
const { sendEmail } = require("../services/nodemailer.services.js");

async function gatePassEntry(req, res) {
  const { name, applyFor, outDate, outTime, inDate, inTime, reason, hostel } =
    req.body;

  if (!applyFor || !outDate || !outTime || !inTime || !reason) {
    return res.status(400).json({ error: "All Fields Are Required" });
  }

  const existingGatePass = await Gatepass.findOne({
    outDate: outDate,
    createdBy: req.user.id,
  });

  if (existingGatePass) {
    return res
      .status(400)
      .json({ error: "Gatepass For This Date Already Exists" });
  }

  await Gatepass.create({
    name,
    leaveType: applyFor,
    outDate,
    outTime,
    inDate,
    inTime,
    reason,
    createdBy: req.user.id,
    hostel,
  });

  return res.status(201).json({ message: "Gatepass Applied Successfully" });
}

async function getAllGatepass(req, res) {
  const gatepasses = await Gatepass.find({ createdBy: req.user.id });

  if (!gatepasses) {
    return res.json({ message: "No Gatepass Yet", gatepasses });
  }

  return res.status(200).json({ gatepasses });
}

async function gatePassEdit(req, res) {
  const { applyFor, outDate, outTime, inDate, inTime, reason } = req.body;

  if (!applyFor || !outDate || !outTime || !inTime || !reason) {
    return res.status(400).json({ error: "All Fields Are Required" });
  }

  const gatepass = await Gatepass.findOne({ outDate });
  if (!gatepass) {
    return res.status(400).json({ error: "Gatepass Does Not Exist" });
  }

  await Gatepass.findOneAndUpdate(
    { outDate },
    {
      leaveType: applyFor,
      outDate,
      outTime,
      inDate,
      inTime,
      reason,
    }
  );

  return res.status(201).json({ message: "Gatepass Updated Successfully" });
}

async function fetchHostelGatepasses(req, res) {
  const hostel = req.params.hostel;
  const gatepasses = await Gatepass.find({ hostel: hostel, status: "Pending" });

  if (gatepasses.length === 0) {
    return res.json({ message: "No Gatepass Yet", gatepasses });
  }

  return res.status(200).json({ gatepasses });
}

async function approveGatepass(req, res) {
  const gatepassId = req.params.gatepassId;
  try {
    const gatepass = await Gatepass.findById(gatepassId).populate("createdBy");
    if (!gatepass) {
      return res.status(404).json({ error: "Gatepass not found" });
    }

    gatepass.status = "Approved";
    gatepass.approvedOrRejectedBy = req.user.name;
    await gatepass.save();

    const studentEmail = gatepass.createdBy.email;

    const htmlContent = `
    <div>
      <p>Dear Student,</p>
      <p>We are pleased to inform you that your gatepass request has been approved.</p>
      <p><b>Details:</b></p>
      <p>Name: ${gatepass.name}</p>
      <p>Leave Type: ${gatepass.leaveType}</p>
      <p>Out Date: ${new Date(gatepass.outDate).toLocaleDateString("en-GB")}</p>
      <p>Out Time: ${gatepass.outTime}</p>
      <p>Reason: ${gatepass.reason}</p>
      <p>Thank you for your patience!</p>
      <p>If you have any further questions or concerns, please feel free to reach out.</p>
      <p>Best regards,</p>
      <p><b>${req.user.name}</b></p>
    </div>
    `;

    await sendEmail(
      studentEmail,
      "Your Gatepass has been Approved",
      htmlContent
    );

    res.status(200).json({ message: "Gatepass approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to approve gatepass" });
  }
}

async function rejectGatepass(req, res) {
  const gatepassId = req.params.gatepassId;
  try {
    const gatepass = await Gatepass.findById(gatepassId).populate("createdBy");
    if (!gatepass) {
      return res.status(404).json({ error: "Gatepass not found" });
    }

    gatepass.status = "Rejected";
    gatepass.approvedOrRejectedBy = req.user.name;
    await gatepass.save();

    const studentEmail = gatepass.createdBy.email;

    const htmlContent = `
      <p>Dear Student,</p>
      <p>We regret to inform you that your gatepass request has been rejected.</p>
      <p><b>Details:</b></p>
      <p>Name: ${gatepass.name}</p>
      <p>Leave Type: ${gatepass.leaveType}</p>
      <p>Out Date: ${new Date(gatepass.outDate).toLocaleDateString("en-GB")}</p>
      <p>Out Time: ${gatepass.outTime}</p>
      <p>Reason: ${gatepass.reason}</p>
      <p>If you have further concerns or additional information, please feel free to reach out.</p>
      <p>Thank you for your understanding.</p>
      <p>Best regards,</p>
      <p><b>${req.user.name}</b></p>
    `;

    await sendEmail(
      studentEmail,
      "Your Gatepass has been Rejected",
      htmlContent
    );

    res.status(200).json({ message: "Gatepass rejected successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to reject gatepass" });
  }
}

async function searchGatepasses(req, res) {
  const { search } = req.query;
  try {
    const gatepasses = await Gatepass.find({
      name: { $regex: search, $options: "i" },
      status: "Pending",
    });
    res.status(200).json({ gatepasses });
  } catch (error) {
    res.status(400).json({ error: "Failed to search gatepasses" });
  }
}

module.exports = {
  gatePassEntry,
  getAllGatepass,
  gatePassEdit,
  fetchHostelGatepasses,
  approveGatepass,
  rejectGatepass,
  searchGatepasses,
};
