const Complaints = require("../models/complaints.model.js");
const { sendEmail } = require("../services/nodemailer.services.js");

async function raiseComplaint(req, res) {
  const { name, compType, compDetails, hostel } = req.body;

  try {
    await Complaints.create({
      name,
      complaintType: compType,
      complaintDetails: compDetails,
      createdBy: req.user.id,
      hostel,
    });

    return res
      .status(201)
      .json({ message: "Complaint Registered Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(404).json("Error Occurred");
  }
}

async function getComplaintsByUser(req, res) {
  try {
    const allComplaints = await Complaints.find({ createdBy: req.user.id });
    if (!allComplaints) {
      return res.json({ message: "No Complaints Yet", allComplaints });
    }

    return res.status(200).json({ allComplaints });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Error Occurred" });
  }
}

async function getComplaintsByHostel(req, res) {
  try {
    const allComplaints = await Complaints.find({
      hostel: req.user.hostel,
      status: "Pending",
    });
    if (!allComplaints) {
      return res.json({ message: "No Complaints Yet", allComplaints });
    }

    return res.status(200).json({ allComplaints });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Error Occurred" });
  }
}

async function handleResolve(req, res) {
  const complaintId = req.params.complaintID;
  try {
    const complaint = await Complaints.findById(complaintId).populate(
      "createdBy"
    );
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    complaint.status = "Resolved";
    await complaint.save();

    const studentEmail = complaint.createdBy.email;

    const htmlContent = `
      <p>Dear Student,</p>
      <p>We are pleased to inform you that your complaint regarding:</p>
      <p><b>"${complaint.complaintDetails}"</b></p>
      <p>has been resolved. Thank you for your patience!</p>
      <p>If you have any further questions or concerns, please feel free to reach out.</p>
      <p>Best regards,</p>
      <p><b>${req.user.name}</b></p>
    `;

    await sendEmail(
      studentEmail,
      "Your Complaint has been Resolved",
      htmlContent 
    );

    res.status(200).json({ message: "Complaint Resolved successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to resolve complaint" });
  }
}

async function handleDismiss(req, res) {
  const complaintId = req.params.complaintID;
  try {
    const complaint = await Complaints.findById(complaintId).populate(
      "createdBy"
    );
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    complaint.status = "Dismissed";
    await complaint.save();

    const studentEmail = complaint.createdBy.email;

    const htmlContent = `
      <p>Dear Student,</p>
      <p>We regret to inform you that your complaint regarding:</p>
      <p><b>"${complaint.complaintDetails}"</b></p>
      <p>has been dismissed. If you have further concerns or additional information, please feel free to reach out.</p>
      <p>Thank you for your understanding.</p>
      <p>Best regards,</p>
      <p><b>${req.user.name}</b></p>
    `;

    await sendEmail(
      studentEmail,
      "Your Complaint has been Dismissed",
      htmlContent 
    );

    res.status(200).json({ message: "Complaint Dismissed successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to dismiss complaint" });
  }
}

async function searchComplaints(req, res) {
  const { search } = req.query;
  try {
    const complaints = await Complaints.find({
      name: { $regex: search, $options: "i" },
      status: "Pending",
    });
    res.status(200).json({ complaints });
  } catch (error) {
    res.status(400).json({ error: "Failed to search complaints" });
  }
}

module.exports = {
  raiseComplaint,
  getComplaintsByUser,
  getComplaintsByHostel,
  handleResolve,
  handleDismiss,
  searchComplaints,
};
