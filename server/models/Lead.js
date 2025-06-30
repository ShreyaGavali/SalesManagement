import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  receivedDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'ongoing', 'pending'],
    default: 'ongoing',
  },
  type: {
    type: String,
    enum: ['hot', 'warm', 'cold'],
    default: 'warm',
  },
  language: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null,
  },
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
