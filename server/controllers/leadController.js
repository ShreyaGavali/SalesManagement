import Lead from '../models/Lead.js';
import Employee from '../models/Employee.js';
import { parseCSV } from '../utils/csvParser.js';
import Activity from '../models/Activity.js';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);

const VALID_STATUSES = ['open', 'closed', 'ongoing', 'pending'];
const VALID_TYPES = ['hot', 'warm', 'cold'];

export const uploadLeads = async (req, res) => {
  try {
    const leads = await parseCSV(req.file.path);
    const employees = await Employee.find();
    const grouped = {};

    for (const emp of employees) {
      const key = `${emp.language}_${emp.location}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(emp);
    }

    const insertedLeads = [];
    const validationErrors = [];

    for (const [index, lead] of leads.entries()) {
      const rowNumber = index + 2; // +2 to account for header and 0-index

      // Required fields
      const missingFields = ['name', 'email', 'phone', 'language', 'location', 'receivedDate']
        .filter(field => !lead[field]);
      if (missingFields.length) {
        validationErrors.push(`Row ${rowNumber}: Missing fields - ${missingFields.join(', ')}`);
        continue;
      }

      // Email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(lead.email)) {
        validationErrors.push(`Row ${rowNumber}: Invalid email format (${lead.email})`);
        continue;
      }

      // Phone format
      if (lead.phone.length < 8 || lead.phone.length > 15) {
        validationErrors.push(`Row ${rowNumber}: Invalid phone number (${lead.phone})`);
        continue;
      }

      // Date format
      const parsedDate = dayjs(lead.receivedDate, 'DD-MM-YYYY', true);
      if (!parsedDate.isValid()) {
        validationErrors.push(`Row ${rowNumber}: Invalid date format (${lead.receivedDate})`);
        continue;
      }

      // Enums
      const status = lead.status?.toLowerCase();
      if (status && !VALID_STATUSES.includes(status)) {
        validationErrors.push(`Row ${rowNumber}: Invalid status (${lead.status})`);
        continue;
      }

      const type = lead.type?.toLowerCase();
      if (type && !VALID_TYPES.includes(type)) {
        validationErrors.push(`Row ${rowNumber}: Invalid type (${lead.type})`);
        continue;
      }

      // mployee assignment
      let assignedEmployee = null;
      if (lead.assignedEmployee && mongoose.Types.ObjectId.isValid(lead.assignedEmployee)) {
        const employee = await Employee.findById(lead.assignedEmployee);
        if (employee) {
          assignedEmployee = employee._id;
        }
      }

      if (!assignedEmployee) {
        const key = `${lead.language}_${lead.location}`;
        const candidates = grouped[key] || [];
        if (candidates.length > 0) {
          const index = insertedLeads.length % candidates.length;
          assignedEmployee = candidates[index]._id;
        }
      }

      // Save lead
      const newLead = await Lead.create({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        receivedDate: parsedDate.toDate(),
        status: status || 'ongoing',
        type: type || 'warm',
        language: lead.language,
        location: lead.location,
        assignedEmployee,
      });

      insertedLeads.push(newLead);

      if (assignedEmployee) {
        const assignedEmp = await Employee.findById(assignedEmployee);
        await Activity.create({
          message: `You assigned lead "${newLead.name}" to ${assignedEmp.firstname} ${assignedEmp.lastname}.`
        });
      }

      if (assignedEmployee) {
        await Activity.create({
          message: `A new lead (${newLead.name}) was assigned to you.`,
          employee: assignedEmployee,
        });

        await Employee.findByIdAndUpdate(assignedEmployee, {
          $inc: { assignedLeads: 1 }
        });
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Some rows failed validation.',
        errors: validationErrors,
      });
    }

    res.status(201).json({ message: 'Leads uploaded and assigned successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error uploading leads' });
  }
};


export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ receivedDate: -1 }); // newest first
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

export const getLeadsByEmployee = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const leads = await Lead.find({ assignedEmployee: employeeId });
    res.status(200).json(leads);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leads', error: err.message });
  }
};


export const updateLead = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLead) return res.status(404).json({ message: "Lead not found" });

    // If lead is marked as closed
    if (req.body.status === 'closed') {
      const employee = await Employee.findById(updatedLead.assignedEmployee);

      if (employee) {
        const employeeName = employee.firstname;

        // 🔹 For employee dashboard
        await Activity.create({
          message: `You closed the lead ${updatedLead.name}.`,
          employee: employee._id,
        });

        // For admin dashboard
        await Activity.create({
          message: `${employeeName} has closed a lead.`,
          // No employee field → Admin sees this
        });
      }
    }

    res.status(200).json(updatedLead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateLeadStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const prevStatus = lead.status;

    // Update lead status
    lead.status = status;
     if (status === 'closed') {
      lead.closedDate = new Date();
    }
    await lead.save();

    // If lead is newly closed, increment closedLeads
    if (prevStatus !== 'closed' && status === 'closed' && lead.assignedEmployee) {
      await Employee.findByIdAndUpdate(
        lead.assignedEmployee,
        { $inc: { closedLeads: 1 } }
      );
    }

    res.status(200).json({ message: "Lead status updated successfully", lead });
  } catch (err) {
    console.error("Failed to update lead status", err);
    res.status(500).json({ error: "Server error while updating lead status" });
  }
};


export const getUnassignedLeadsCount = async (req, res) => {
  try {
    const count = await Lead.countDocuments({ assignedEmployee: null });
    res.status(200).json({ unassignedLeads: count });
  } catch (err) {
    console.error("Error fetching unassigned leads count:", err);
    res.status(500).json({ error: "Failed to fetch unassigned leads count" });
  }
};


export const getLeadsAssignedThisWeek = async (req, res) => {
  try {
    const today = dayjs();
    const startOfWeek = today.startOf('week').add(1, 'day'); // Monday (if week starts on Sunday)

    const count = await Lead.countDocuments({
      assignedEmployee: { $ne: null },
      createdAt: {
        $gte: startOfWeek.toDate(),
        $lte: today.toDate(),
      },
    });

    res.status(200).json({ leadsAssignedThisWeek: count });
  } catch (err) {
    console.error('Error getting weekly assigned leads:', err);
    res.status(500).json({ error: 'Failed to fetch assigned leads this week' });
  }
};

export const getConversionRate = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const closedLeads = await Lead.countDocuments({ status: 'closed' });

    const conversionRate = totalLeads === 0 ? 0 : ((closedLeads / totalLeads) * 100).toFixed(2);

    res.status(200).json({ conversionRate: `${conversionRate}%` });
  } catch (err) {
    console.error('Error calculating conversion rate:', err);
    res.status(500).json({ error: 'Failed to calculate conversion rate' });
  }
};

export const getSalesData = async (req, res) => {
  try {
    const today = dayjs().startOf('day');
    const fourteenDaysAgo = today.subtract(13, 'day');

    const leads = await Lead.find({
      closedDate: {
        $gte: fourteenDaysAgo.toDate(),
        $lte: dayjs().toDate(),
      },
      status: 'closed'
    });

    const salesMap = {};

    for (let i = 0; i < 14; i++) {
      const date = today.subtract(i, 'day').format('YYYY-MM-DD');
      salesMap[date] = 0;
    }

    leads.forEach((lead) => {
      const dateKey = dayjs(lead.closedDate).format('YYYY-MM-DD');
      if (salesMap[dateKey] !== undefined) {
        salesMap[dateKey]++;
      }
    });

    const chartData = Object.keys(salesMap)
      .sort()
      .map((date) => ({
        day: dayjs(date).format('DD MMM'),
        date,
        sales: salesMap[date],
      }));

    res.json(chartData);
  } catch (err) {
    console.error("Failed to generate sales data:", err);
    res.status(500).json({ error: "Failed to generate sales data" });
  }
};
