import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  scheduleType: {
    type: String,
    enum: ['call', 'referral'],
    required: true
  },
  date: {
    type: Date,
    required: true // full datetime
  },
  scheduleTime: {
    type: String, // e.g., "14:30" or "02:30 PM"
    required: true
  },
  leadName: {
    type: String,
    required: true
  },
  leadPhone: {
    type: String,
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  }
});

export default mongoose.model('Schedule', scheduleSchema);
