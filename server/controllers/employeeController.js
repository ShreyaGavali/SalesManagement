import Employee from '../models/Employee.js';
import Lead from '../models/Lead.js';
import Attendance from '../models/Attendance.js'

// CREATE
export const createEmployee = async (req, res) => {
  try {
    const { firstname, lastname, email, language, location } = req.body;

    const newEmployee = await Employee.create({
      firstname,
      lastname,
      email,
      password: lastname, // Set password as lastname
      language,
      location,
    });

    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
// export const deleteEmployee = async (req, res) => {
//   try {
//     const deleted = await Employee.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: 'Employee not found' });
//     res.status(200).json({ message: 'Employee deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const getEmployeesWithLeadCounts = async (req, res) => {
  try {
    const leadCounts = await Lead.aggregate([
      { $match: { assignedEmployee: { $ne: null } } },
      { $group: { _id: "$assignedEmployee", count: { $sum: 1 } } }
    ]);

    const leadMap = {};
    leadCounts.forEach(item => {
      leadMap[item._id.toString()] = item.count;
    });

    const employees = await Employee.find();

    const enriched = employees.map(emp => ({
      ...emp.toObject(),
      assignedLeads: leadMap[emp._id.toString()] || 0
    }));

    res.status(200).json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employee data' });
  }
};

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   const employee = await Employee.findOne({ email });
//   if (!employee || employee.password !== password) {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }

//   // Save user ID in session
//   req.session.employeeId = employee._id;
//   res.json({
//     message: 'Login successful',
//     employeeId: employee._id
//   });
// }

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   const employee = await Employee.findOne({ email });
//   if (!employee || employee.password !== password) {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }

//   req.session.employeeId = employee._id;

//   const todayDate = new Date().toISOString().split('T')[0];

//   const existingAttendance = await Attendance.findOne({
//     employeeId: employee._id,
//     date: todayDate
//   });

//   if (!existingAttendance) {
//     // First login of the day → create attendance with checkIn
//     await Attendance.create({
//       employeeId: employee._id,
//       date: todayDate,
//       checkIn: new Date()
//     });
//   }

//   res.json({
//     message: 'Login successful',
//     employeeId: employee._id
//   });
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   const employee = await Employee.findOne({ email });
//   if (!employee || employee.password !== password) {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }

//   req.session.employeeId = employee._id;

//   setTimeout(() => {
//   autoCheckout(employee._id);
// }, 8 * 60 * 60 * 1000); // 8 hours in ms


//   const todayDate = new Date().toISOString().split('T')[0];

//   let attendance = await Attendance.findOne({
//     employeeId: employee._id,
//     date: todayDate
//   });

//   if (!attendance) {
//     // First login of the day → create attendance with checkIn
//     attendance = await Attendance.create({
//       employeeId: employee._id,
//       date: todayDate,
//       checkIn: new Date()
//     });
//   } else {
//     // Break end logic here (if last break has no breakEnd)
//     const breaks = attendance.breaks;
//     if (breaks.length > 0) {
//       const lastBreak = breaks[breaks.length - 1];
//       if (!lastBreak.breakEnd) {
//         lastBreak.breakEnd = new Date(); // set current time as breakEnd
//         await attendance.save();        // save updated attendance
//       }
//     }
//   }

//   res.json({
//     message: 'Login successful',
//     employeeId: employee._id
//   });
// };

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find employee
    const employee = await Employee.findOne({ email });
    if (!employee || employee.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Start session
    req.session.employeeId = employee._id;

    // 4. Get today’s date (YYYY-MM-DD)
    const todayDate = new Date().toISOString().split('T')[0];

    // 5. Check if today's attendance exists
    let attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: todayDate
    });

    if (!attendance) {
      // 6. First login today → check-in
      attendance = await Attendance.create({
        employeeId: employee._id,
        date: todayDate,
        checkIn: new Date(),
        breaks: []
      });
    } else {
      // 7. If last break has no breakEnd → end it now
      const breaks = attendance.breaks;
      if (breaks.length > 0) {
        const lastBreak = breaks[breaks.length - 1];
        if (!lastBreak.breakEnd) {
          lastBreak.breakEnd = new Date(); // User is back from break
          await attendance.save();
        }
      }
    }

    // 8. Success response
    res.json({
      message: 'Login successful',
      employeeId: employee._id,
      firstName: employee.firstname,
      lastName: employee.lastname
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// POST /api/employees/break-start
// export const breakStart = async (req, res) => {
//   const { employeeId } = req.body;
//   const today = new Date().toISOString().split('T')[0];

//   const attendance = await Attendance.findOne({ employeeId, date: today });
//   if (attendance) {
//     // Only push breakStart for now, breakEnd will be updated on next login
//     attendance.breaks.push({ breakStart: new Date() });
//     await attendance.save();
//     return res.json({ message: 'Break started' });
//   }

//   res.status(404).json({ message: 'Attendance not found for today' });
// };

export const breakStart = async (req, res) => {
  const { employeeId } = req.body;
  const today = new Date().toISOString().split('T')[0];

  const attendance = await Attendance.findOne({ employeeId, date: today });
  if (attendance) {
    // Only push breakStart for now, breakEnd will be updated on next login
    attendance.breaks.push({ breakStart: new Date() });
    await attendance.save();

    // Mark employee as inactive
    await Employee.findByIdAndUpdate(employeeId, { status: 'inactive' });

    return res.json({ message: 'Break started' });
  }

  res.status(404).json({ message: 'Attendance not found for today' });
};


export const autoCheckout = async (employeeId) => {
  const today = new Date().toISOString().split('T')[0];

  const attendance = await Attendance.findOne({
    employeeId,
    date: today
  });

  if (attendance && !attendance.checkOut) {
    let checkoutTime = new Date(); // fallback to current time

    const breaks = attendance.breaks;
    if (breaks.length > 0) {
      const lastBreak = breaks[breaks.length - 1];

      if (lastBreak.breakStart && !lastBreak.breakEnd) {
        // Incomplete break → remove it and use breakStart as checkOut
        checkoutTime = new Date(lastBreak.breakStart);
        attendance.breaks.pop(); // Remove the last incomplete break
      }
    }

    attendance.checkOut = checkoutTime;
    await attendance.save();
    console.log(`Auto-checkout done for ${employeeId} at ${checkoutTime}`);
  }
};

export const getEmployeeCount = async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    res.status(200).json({ employeeCount: count });
  } catch (err) {
    console.error('Error counting employees:', err);
    res.status(500).json({ error: 'Failed to count employees' });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;

    // Step 1: Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Step 2: Get all leads assigned to this employee that are not 'closed'
    const leadsToReassign = await Lead.find({
      assignedEmployee: employeeId,
      status: { $ne: 'closed' },
    });

    // Step 3: Find other employees with same language and location
    const replacementEmployees = await Employee.find({
      _id: { $ne: employeeId }, // exclude the one being deleted
      language: employee.language,
      location: employee.location,
    });

    if (leadsToReassign.length > 0 && replacementEmployees.length === 0) {
      return res.status(400).json({
        error: 'No suitable replacement employees found to reassign leads.',
      });
    }

    // Step 4: Reassign each lead
    for (let i = 0; i < leadsToReassign.length; i++) {
      const lead = leadsToReassign[i];
      const newAssignee = replacementEmployees[i % replacementEmployees.length];

      lead.assignedEmployee = newAssignee._id;
      await lead.save();

      await Activity.create({
        message: `A lead (${lead.name}) was reassigned from ${employee.firstname} to ${newAssignee.firstname}.`,
        employee: newAssignee._id,
      });

      await Employee.findByIdAndUpdate(newAssignee._id, {
        $inc: { assignedLeads: 1 },
      });
    }

    // Step 5: Delete the employee
    await Employee.findByIdAndDelete(employeeId);

    res.status(200).json({ message: 'Employee deleted and leads reassigned successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while deleting employee' });
  }
};