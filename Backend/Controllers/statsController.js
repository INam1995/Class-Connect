import User from "../models/user.js";
import Folder from "../models/folder.js"; // Assuming this is your File model
export const search = async (req, res)=>{
  try {
    const { query } = req.query;

    // Search for users by username, name, or email
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } }, // Case-insensitive search
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }); // Only return relevant fields

    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error', error });
  }
}

export const getUserStats = async (req, res) => {
  try {
    const { timeRange } = req.query;
    let startDate = new Date();

    // Determine the start date based on the time range
    switch (timeRange) {
      case 'last24hours':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case 'last7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'lastMonth':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'lastYear':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = null;
    }

    const dateFilter = startDate ? { createdAt: { $gte: startDate } } : {};

    // Count active users based on last login within the specified time range
    const activeUsersCount = await User.countDocuments(
      startDate ? { lastLogin: { $gte: startDate } } : {}
    );

    // Aggregate total uploads
    const totalUploads = await Folder.aggregate([
      { $match: dateFilter },
      { $unwind: { path: "$pdfs", preserveNullAndEmptyArrays: true } },
      { $count: "totalUploads" },
    ]);

    // Aggregate total downloads
    const totalDownloads = await Folder.aggregate([
      { $unwind: { path: "$pdfs", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$pdfs.downloadedBy", preserveNullAndEmptyArrays: true } },
      { $match: dateFilter },
      { $count: "totalDownloads" },
    ]);

    const mostActiveUsers = async (req, res) => {
      try {
        const users = await Folder.aggregate([
          { $unwind: "$pdfs" }, // Flatten the PDFs array
          { $match: { "pdfs.completed": true } }, // Only consider completed PDFs
          { 
            $group: { 
              _id: "$pdfs.updatedBy", 
              completedCount: { $sum: 1 } // Count completed PDFs per user
            } 
          },
          { $sort: { completedCount: -1 } }, // Sort by most completed
          { $limit: 5 } // Get top 5 users (adjust as needed)
        ]);
    
        res.status(200).json({ mostActiveUsers: users });
      } catch (error) {
        console.error("Error fetching most active users:", error);
        res.status(500).json({ message: "Server error" });
      }
    };
    res.status(200).json({
      activeUsersCount,
      totalUploads: totalUploads[0]?.totalUploads || 0,
      totalDownloads: totalDownloads[0]?.totalDownloads || 0,
      mostActiveUsers,
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch general statistics
export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalAdmins, totalUploads, totalDownloads] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "admin" }),
      Folder.aggregate([
        { $unwind: { path: "$pdfs", preserveNullAndEmptyArrays: true } },
        { $count: "totalUploads" },
      ]),
      Folder.aggregate([
        { $unwind: { path: "$pdfs", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$pdfs.downloadedBy", preserveNullAndEmptyArrays: true } },
        { $count: "totalDownloads" },
      ]),
    ]);

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalUploads: totalUploads.length > 0 ? totalUploads[0].totalUploads : 0,
      totalDownloads: totalDownloads.length > 0 ? totalDownloads[0].totalDownloads : 0,
    });
  } catch (err) {
    console.error("Error fetching statistics:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};