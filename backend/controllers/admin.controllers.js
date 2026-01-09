const User = require("../models/user.models.js");

async function getHostelStats(req, res) {
  try {
    const stats = await User.aggregate([
      { $match: { role: "Student" } },
      { $group: { _id: "$hostel", count: { $sum: 1 } } },
    ]);

    const totalStudents = stats.reduce((acc, hostel) => acc + hostel.count, 0);

    const percentages = stats.map((hostel) => ({
      hostel: hostel._id,
      percentage: ((hostel.count / totalStudents) * 100).toFixed(2),
    }));

    res.status(200).json({ stats: percentages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching hostel stats" });
  }
}

module.exports = { getHostelStats };
