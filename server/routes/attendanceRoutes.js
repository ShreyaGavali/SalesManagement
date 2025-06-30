import express from 'express';
import {
  getAllAttendance,
} from '../controllers/attendanceController.js';

const router = express.Router();

router.get('/all', getAllAttendance)
export default router;
