import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  checkIn: Date,
  checkOut: Date,
  breaks: [
    {
      breakStart: Date,
      breakEnd: Date,
    }
  ]
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
