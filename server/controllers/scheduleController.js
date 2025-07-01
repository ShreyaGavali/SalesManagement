import Schedule from '../models/Schedule.js';

export const createSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json(schedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getSchedulesByEmployee = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const schedules = await Schedule.find({ employeeId }).populate('leadId', 'email status type');
     const activeSchedules = schedules.filter(
      (schedule) => schedule.leadId && schedule.leadId.status !== 'closed'
    );
    res.status(200).json(activeSchedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getScheduleByLead = async (req, res) => {
  const { leadId } = req.params;
  try {
    const schedules = await Schedule.find({ leadId });
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


