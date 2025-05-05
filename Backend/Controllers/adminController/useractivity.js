import User from '../../models/user.js';

export const getActivityLog = async (req, res) => {
  try {
    const activityStats = await User.aggregate([
      // Unwind the activityLog array to process each entry
      { $unwind: '$activityLog' },
      // Group by user ID and accumulate total logins and time spent
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          totalLogins: { $sum: '$activityLog.logins' },
          totalTimeSpent: { $sum: '$activityLog.totalTimeSpent' },
        },
      },
      {$sort:{_id:1}}
    ]);

    res.status(200).json(activityStats);
  } catch (error) {
    console.error('Error fetching user activity stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
