import React, { useEffect, useState } from "react";
import "./Home.css";

const formatTime = (isoString) => {
  if (!isoString) return "--:--";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (isoString) => {
  if (!isoString) return "--/--/--";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
};

const Home = () => {
  const [checkIn, setCheckIn] = useState("--:--");
  const [breaks, setBreaks] = useState([]);
  const [date, setDate] = useState("--/--/--");
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const employeeId = localStorage.getItem("employeeId");
      if (!employeeId) return;

      try {
        const res = await fetch(`http://localhost:8080/api/activities/recent?employeeId=${employeeId}`);
        const data = await res.json();
        setActivities(data);
      } catch (err) {
        console.error("Failed to fetch recent activity:", err);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchAllAttendance = async () => {
      const employeeId = localStorage.getItem("employeeId");
      if (!employeeId) return;

      try {
        const res = await fetch(`http://localhost:8080/api/attendance/all?employeeId=${employeeId}`);
        const data = await res.json();

        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = data.find(att => att.date === today);

        if (todayAttendance) {
          setCheckIn(formatTime(todayAttendance.checkIn));
          setDate(formatDate(todayAttendance.date));
        }

        const allBreaks = data.flatMap(att =>
          att.breaks.map(br => ({ ...br, date: att.date }))
        );

        setBreaks(allBreaks);

        const latestBreak = allBreaks[allBreaks.length - 1];

        // Employee has checked in AND (either no breaks yet or last break has ended)
        if (todayAttendance?.checkIn && (!latestBreak || latestBreak.breakEnd)) {
          await fetch(`http://localhost:8080/api/employees/${employeeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'active' }),
          });
        } else {
          // If on break or not checked in
          await fetch(`http://localhost:8080/api/employees/${employeeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'inactive' }),
          });
        }

      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchAllAttendance();
  }, []);




  const latestBreak = breaks.length > 0 ? breaks[breaks.length - 1] : null;

  return (
    <div className="timings-container">
      <div className="timings-section">
        <h4 className="time-heading">Timings</h4>

        {/* Check-in card */}
        <div className="timing-card">
          <div className="checkin">
            <p>Checked-in</p>
            <span>{checkIn}</span>
          </div>
          <div className="checkout">
            <p>Check Out</p>
            <span>--:--</span>
          </div>
          <div className="status-indicator green" />
        </div>

        {/* Latest break card */}
        {latestBreak && (
          <div className="timing-card">
            <div className="checkin">
              <p>Break</p>
              <span>{formatTime(latestBreak.breakStart)}</span>
            </div>
            <div className="checkout">
              <p>Ended</p>
              <span>{formatTime(latestBreak.breakEnd)}</span>
            </div>
            {latestBreak.breakEnd && <div className="status-indicator red" />}
          </div>
        )}

        {/* Full break list */}
        {breaks.length > 0 && (
          <div className="card full-breaks">
            {breaks.map((item, index) => (
              <div key={index} className="break-row">
                <div>
                  <p className="label">Break</p>
                  <p>{formatTime(item.breakStart)}</p>
                </div>
                <div>
                  <p className="label">Ended</p>
                  <p>{formatTime(item.breakEnd)}</p>
                </div>
                <div>
                  <p className="label">Date</p>
                  <p>{formatDate(item.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="recent-activity">
        <h4>Recent Activity</h4>
        <div className="activity-box">
          {activities.length === 0 ? (
            <p>No recent activity</p>
          ) : (
            activities.map((activity, index) => (
              <p key={index}>• {activity.message}</p>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

