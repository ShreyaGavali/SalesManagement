import express from 'express';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeesWithLeadCounts,
  login,
  breakStart,
  getEmployeeCount,
} from '../controllers/employeeController.js';

const router = express.Router();

router.post('/login', login)
router.post('/break-start', breakStart)
router.post('/', createEmployee);
router.get('/', getEmployeesWithLeadCounts);
router.get('/', getAllEmployees);
router.get('/count', getEmployeeCount);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
