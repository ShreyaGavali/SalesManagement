import React, { useState } from 'react';
import './LeadCard.css';
import calenderImg from '../../assets/Calendar.png';
import img from '../../assets/Vector7.png';  // type icon
import img1 from '../../assets/Vector8.png'; // date/time icon
import img2 from '../../assets/Vector9.png'; // status icon
import axios from 'axios';
import { useRef, useEffect } from 'react';

const LeadCard = ({ lead }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { _id, name, email, receivedDate, type, status } = lead;
  const [leadType, setLeadType] = useState(type);
  const [isLeadScheduled, setIsLeadScheduled] = useState(false);

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [leadStatus, setLeadStatus] = useState(status);

  const [scheduledDateTime, setScheduledDateTime] = useState(null);

  const typeRef = useRef();
  const editRef = useRef();
  const statusRef = useRef();

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      typeRef.current && !typeRef.current.contains(event.target) &&
      editRef.current && !editRef.current.contains(event.target) &&
      statusRef.current && !statusRef.current.contains(event.target)
    ) {
      setShowTypeDropdown(false);
      setShowEditPopup(false);
      setShowStatusPopup(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleTypeClick = () => {
    setShowTypeDropdown(!showTypeDropdown);
    setShowEditPopup(false);
    setShowStatusPopup(false);
  };

  const handleEditClick = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/schedules/lead/${_id}`);
      if (res.data && res.data.length > 0) {
        setIsLeadScheduled(true);
        const schedule = res.data[0];
        const combinedDate = new Date(schedule.date);

        if (schedule.scheduleTime) {
          const [hour, minute] = schedule.scheduleTime.split(":");
          combinedDate.setHours(parseInt(hour), parseInt(minute));
        } else {
          console.warn("Schedule time is missing.");
        }

        setScheduledDateTime(combinedDate);
        setShowEditPopup(true);
      } else {
        setIsLeadScheduled(false);
        setShowEditPopup(true);
      }
    } catch (err) {
      console.error("Failed to check if lead is scheduled", err);
    }

    setShowTypeDropdown(false);
    setShowStatusPopup(false);
  };

  const toggleStatusPopup = async () => {
    setShowTypeDropdown(false);
    setShowEditPopup(false);

    if (!scheduledDateTime) {
      try {
        const res = await axios.get(`${backendUrl}/api/schedules/lead/${_id}`);
        if (res.data && res.data.length > 0) {
          const schedule = res.data[0];
          const combinedDate = new Date(schedule.date);

          if (schedule.scheduleTime) {
            const [hour, minute] = schedule.scheduleTime.split(":");
            combinedDate.setHours(parseInt(hour), parseInt(minute));
          } else {
            console.warn("Schedule time is missing.");
          }

          setScheduledDateTime(combinedDate);
        }
      } catch (err) {
        console.error("Failed to fetch schedule for status check", err);
      }
    }

    setShowStatusPopup(!showStatusPopup);
  };

  console.log("Scheduled time:", scheduledDateTime);


  const handleDateSave = async () => {
    const [hour, minute] = time.split(':');
    const scheduleDate = new Date(date);
    scheduleDate.setHours(parseInt(hour), parseInt(minute));

    const scheduleTime = `${hour}:${minute}`; // or format to 12hr with AM/PM if needed
    const employeeId = localStorage.getItem('employeeId');
    const leadPhone = lead.phone || "0000000000";

    const payload = {
      scheduleType: 'call', // you can change dynamically if needed
      date: scheduleDate,
      scheduleTime: scheduleTime,
      leadName: name,
      leadPhone: leadPhone,
      employeeId,
      leadId: _id
    };

    try {
      const res = await axios.post(`${backendUrl}/api/schedules/create`, payload);
      alert("Schedule saved!");
      setShowEditPopup(false);
    } catch (err) {
      console.error("Failed to save schedule:", err);
      alert("Error saving schedule.");
    }
  };


  const handleStatusSave = async () => {
    // console.log('Saved lead status update:', leadStatus);
    // setShowStatusPopup(false);
    const now = new Date();

    if (leadStatus === 'closed' && scheduledDateTime && now < scheduledDateTime) {
      alert("You can only close this lead after the scheduled time.");
      return;
    }

    try {
      const response = await axios.put(`${backendUrl}/api/leads/${_id}/status`, {
        status: leadStatus,
      });

      console.log("Status updated:", response.data);
      setShowStatusPopup(false);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Error updating status.");
    }

    // Save to backend here
    // console.log('Saved lead status update:', leadStatus);
    // setShowStatusPopup(false);
  };

  const handleTypeSelect = async (selectedType) => {
    try {
      const response = await axios.put(`${backendUrl}/api/leads/${_id}`, {
        type: selectedType,
      });
      setLeadType(response.data.type);
      setShowTypeDropdown(false);
      console.log("Type updated to:", response.data.type);
    } catch (err) {
      console.error("Failed to update type", err);
    }
  };

  return (
    <div className="lead-card">
      <div className="lead-details">
        <div className="lead-name-email">
          <p className="lead-name">{name}</p>
          <p className="lead-email">@{email}</p>
        </div>
        <div className="lead-date-text">
          <p className="lead-text">Date</p>
          <div className="lead-date">
            <img src={calenderImg} alt="" />
            <p>{formatDate(receivedDate)}</p>
          </div>
        </div>
      </div>

      <div className="lead-status-btn">
        {/* <div className="lead-status">{leadType}</div> */}
        <div className={`lead-status-${leadType}`}>{leadStatus.charAt(0).toUpperCase() + leadStatus.slice(1)}</div>
        <div className="lead-btn">
          {/* Type popup */}
          <div className="dropdown-wrapper" ref={typeRef}>
            <img src={img} alt="type" onClick={() => setShowTypeDropdown(!showTypeDropdown)} />
            {showTypeDropdown && (
              <div className="type-dropdown">
                <p className="dropdown-title">Type</p>
                <div className="type-option hot" onClick={() => handleTypeSelect("hot")}>Hot</div>
                <div className="type-option warm" onClick={() => handleTypeSelect("warm")}>Warm</div>
                <div className="type-option cold" onClick={() => handleTypeSelect("cold")}>Cold</div>
              </div>
            )}
          </div>

          {/* Date/Time popup */}
          <div className="popup-wrapper" ref={editRef}>
            <img src={img1} alt="edit" onClick={handleEditClick} />
            {showEditPopup && (
              <div className="edit-popup">
                {isLeadScheduled ? (
                  <>
                    <p className="error-text">This lead is already scheduled.</p>
                    <button onClick={() => setShowEditPopup(false)}>Close</button>
                  </>
                ) : (
                  <>
                    <label>Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    <label>Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                    <button onClick={handleDateSave}>Save</button>
                    <button onClick={() => setShowEditPopup(false)}>Close</button>
                  </>
                )}
              </div>
            )}

          </div>

          {/* Status popup */}
          <div className="popup-wrapper" ref={statusRef}>
            <img src={img2} alt="status" onClick={toggleStatusPopup} />
            {showStatusPopup && (
              <div className="status-popup">
                <p className="popup-title">Lead Status</p>
                <select value={leadStatus} onChange={(e) => setLeadStatus(e.target.value)}>
                  <option value="ongoing"  disabled={leadStatus === 'closed'}>Ongoing</option>
                  <option value="closed" disabled={scheduledDateTime && new Date() < scheduledDateTime}>Closed</option>
                </select>
                <button onClick={handleStatusSave}>Save</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;

