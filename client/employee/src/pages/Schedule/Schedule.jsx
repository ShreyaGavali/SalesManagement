import React, { useEffect, useState } from 'react';
import './Schedule.css';
import SearchFilter from '../../components/SearchFilter/SearchFilter';
import ScheduleCard from '../../components/ScheduleCard/ScheduleCard';
import axios from 'axios';

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchSchedules = async () => {
      const employeeId = localStorage.getItem('employeeId');
      if (!employeeId) return;

      try {
        const res = await axios.get(`http://localhost:8080/api/schedules/employee/${employeeId}`);
        setSchedules(res.data);
        setFilteredSchedules(res.data);
      } catch (err) {
        console.error("Failed to fetch schedules:", err);
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
    </div>
  );
};

export default Schedule;
