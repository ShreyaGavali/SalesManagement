import express from 'express';
import multer from 'multer';
import { getAllLeads, getConversionRate, getLeadsAssignedThisWeek, getLeadsByEmployee, getSalesData, getUnassignedLeadsCount, updateLead, updateLeadStatus, uploadLeads } from '../controllers/leadController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), uploadLeads); // First
router.get('/', getAllLeads); // Second
router.get('/unassigned-count', getUnassignedLeadsCount);
router.get('/assigned-this-week', getLeadsAssignedThisWeek);
router.get('/conversion-rate', getConversionRate);
router.get('/sales-data', getSalesData);
router.get('/:employeeId', getLeadsByEmployee); // Last
router.put('/:id', updateLead);
router.put('/:id/status', updateLeadStatus);


export default router;
