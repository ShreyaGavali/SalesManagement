// import cron from 'node-cron';
// import Attendance from '../models/Attendance.js';

// cron.schedule('*/5 * * * *', async () => {
//   const now = new Date();
//   const today = now.toISOString().split('T')[0];

//   const records = await Attendance.find({
//     date: today,
//     checkOut: { $exists: false }
//   });

//   for (const record of records) {
//     const hoursSinceCheckIn = (now - new Date(record.checkIn)) / (1000 * 60 * 60);

//     if (hoursSinceCheckIn >= 8) {
//       let checkoutTime = now;
//       const breaks = record.breaks || [];

//       if (breaks.length > 0) {
//         const lastBreak = breaks[breaks.length - 1];
//         if (lastBreak.breakStart && !lastBreak.breakEnd) {
//           checkoutTime = new Date(lastBreak.breakStart);
//           record.breaks.pop();
//         }
//       }

//       record.checkOut = checkoutTime;
//       await record.save();

//       console.log(`Auto checkout done for ${record.employeeId} at ${checkoutTime}`);
//     }
//   }
// });


import cron from 'node-cron';
import Attendance from '../models/Attendance.js';

cron.schedule('*/5 * * * *', async () => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const records = await Attendance.find({
    date: today,
    checkOut: { $exists: false }
  });

  for (const record of records) {
    const checkInTime = new Date(record.checkIn);
    const hoursSinceCheckIn = (now - checkInTime) / (1000 * 60 * 60);
    const breaks = record.breaks || [];
    const lastBreak = breaks.length > 0 ? breaks[breaks.length - 1] : null;

    // 1. User never returned from break for 30+ mins
    if (lastBreak && lastBreak.breakStart && !lastBreak.breakEnd) {
      const breakStart = new Date(lastBreak.breakStart);
      const minutesSinceBreak = (now - breakStart) / (1000 * 60);

      if (minutesSinceBreak >= 30) {
        // Remove incomplete break and set checkout at break start
        record.breaks.pop();
        record.checkOut = breakStart;
        await record.save();

        console.log(`Auto-checkout (no return from break) for ${record.employeeId} at ${breakStart}`);
        continue;
      }
    }

    // 2. Still on system after 8 hrs → normal auto-checkout
    if (hoursSinceCheckIn >= 8) {
      record.checkOut = now;
      await record.save();

      console.log(`Auto-checkout after 8 hrs for ${record.employeeId} at ${now}`);
    }
  }
});
