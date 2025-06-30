// controllers/attendanceController.js
import Attendance from '../models/Attendance.js';

// GET /api/attendance/today?employeeId=...

// export const getTodayAttendance = async (req, res) => {
//   const { employeeId } = req.query;
//   const today = new Date().toISOString().split('T')[0];

//   const attendance = await Attendance.findOne({ employeeId, date: today });
//   if (!attendance) return res.status(404).json({ message: 'No attendance found' });

//   res.json(attendance);
// };

// GET /api/attendance/all?employeeId=...
export const getAllAttendance = async (req, res) => {
  const { employeeId } = req.query;
  try {
    const records = await Attendance.find({ employeeId });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
