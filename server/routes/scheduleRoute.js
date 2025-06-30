import express from 'express';
import { createSchedule, getScheduleByLead, getSchedulesByEmployee } from '../controllers/scheduleController.js';

const router = express.Router();

router.post('/create', createSchedule);
router.get('/employee/:employeeId', getSchedulesByEmployee);
router.get('/lead/:leadId', getScheduleByLead);

export default router;