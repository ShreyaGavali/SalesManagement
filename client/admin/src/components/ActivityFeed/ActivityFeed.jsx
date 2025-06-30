import React, { useEffect, useState } from 'react';
import './ActivityFeed.css';
import axios from 'axios';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
   const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/activities/recent`);
        setActivities(res.data);
      } catch (err) {
        console.error('Error fetching activity feed:', err);
      }
    };

    fetchActivities();
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000); // in seconds

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour ago`;
    return `${Math.floor(diff / 86400)} day ago`;
  };

  return (
    <div className='activity-feed'>
      <p className='activity-heading'>Recent Activity Feed</p>
      <ul>
        {activities.length === 0 ? (
          <li>No recent activity</li>
        ) : (
          activities.map((activity, index) => (
            <li key={index}>
              {activity.message} - {formatTimeAgo(activity.createdAt)}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ActivityFeed;
