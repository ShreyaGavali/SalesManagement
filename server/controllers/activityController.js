import Activity from '../models/Activity.js';

export const getRecentActivities = async (req, res) => {
  try {
    const { employeeId } = req.query;

    const filter = employeeId ? { employee: employeeId } : { employee: null };

    const activities = await Activity.find(filter)
      .sort({ createdAt: -1 })
      .limit(10); // latest 10 activities

    res.status(200).json(activities);
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};
