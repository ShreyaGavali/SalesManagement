import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: false, // optional for admin activity
  },
}, { timestamps: true }); // adds createdAt and updatedAt automatically

export default mongoose.model('Activity', activitySchema);
