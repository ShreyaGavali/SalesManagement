import React, { useEffect, useState } from 'react';
import './Schedule.css';
import SearchFilter from '../../components/SearchFilter/SearchFilter';
import ScheduleCard from '../../components/ScheduleCard/ScheduleCard';
import axios from 'axios';

const Schedule = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      const employeeId = localStorage.getItem('employeeId');
      if (!employeeId) return;

      try {
        const res = await axios.get(`${backendUrl}/api/schedules/employee/${employeeId}`);
        setSchedules(res.data);
        setFilteredSchedules(res.data);
      } catch (err) {
        console.error("Failed to fetch schedules:", err);
      }finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  useEffect(() => {
  const filtered = schedules.filter((item) => {
    const search = searchText.toLowerCase();
    return (
      item.leadName?.toLowerCase().includes(search) ||
      item.leadPhone?.toLowerCase().includes(search) ||
      item.scheduleType?.toLowerCase().includes(search)
    );
  });

  setFilteredSchedules(filtered);
}, [searchText, schedules]);

  const handleFilterChange = (selected) => {
    if (selected === 'today') {
      const today = new Date();
      const filtered = schedules.filter((item) => {
        const scheduleDate = new Date(item.date);
        return (
          scheduleDate.getDate() === today.getDate() &&
          scheduleDate.getMonth() === today.getMonth() &&
          scheduleDate.getFullYear() === today.getFullYear()
        );
      });
      setFilteredSchedules(filtered);
    } else {
      setFilteredSchedules(schedules);
    }
  };

  return (
    <div className='schedule'>
      {loading ? (
      <div className="loader-container">
        <div className="spinner" />
        <p className="loading-text">Data is fetching from backend...</p>
      </div>
    ) : (
      <>
      <SearchFilter filterOptions={['today', 'all']}
       onFilterChange={handleFilterChange}  onSearch={setSearchText}/>
      <div className="schedule-cards">
        {filteredSchedules.length === 0 ? (
          <p>No scheduled leads found.</p>
        ) : (
          filteredSchedules.map((item) => (
            <ScheduleCard key={item._id} schedule={item} />
          ))
        )}
      </div>
      </>
    )}
    </div>
  );
};

export default Schedule;
