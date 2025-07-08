import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import './cron/autoCheckout.js';

dotenv.config();

import leadRoutes from './routes/leadRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import scheduleRoutes from './routes/scheduleRoute.js';
import activityRoutes from './routes/activityRoutes.js';

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', "https://sales-management-peach.vercel.app", "https://sales-management-4hew.vercel.app"],
  credentials: true                 
}));
app.use(express.json({ type: ['application/json', 'text/plain'] }));

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
  cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 hours
}));

// Routes
app.use("/api/leads", leadRoutes);
app.use("/api/employees", employeeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attendance', attendanceRoutes)
app.use('/api/schedules', scheduleRoutes);
app.use('/api/activities', activityRoutes);


// DB Connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
