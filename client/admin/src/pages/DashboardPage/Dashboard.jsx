import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import card1Img from '../../assets/Card1-Img.png';
import card2Img from '../../assets/Card2-Img.png';
import card3Img from '../../assets/Card3-Img.png';
import card4Img from '../../assets/Card4-Img.png';
import SalesChart from '../../components/SalesChart/SalesChart';
import ActivityFeed from '../../components/ActivityFeed/ActivityFeed';
import EmployeeTable from '../../components/DashboardEmployeeTable/EmployeeTable';
import axios from 'axios';

const Dashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [unassignedCount, setUnassignedCount] = useState(0);
  const [assignedThisWeek, setAssignedThisWeek] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [conversionRate, setConversionRate] = useState("0%");
  const [salesData, setSalesData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          unassignedRes,
          assignedWeekRes,
          empCountRes,
          conversionRes,
          salesRes,
          employeesRes
        ] = await Promise.all([
          axios.get(`${backendUrl}/api/leads/unassigned-count`),
          axios.get(`${backendUrl}/api/leads/assigned-this-week`),
          axios.get(`${backendUrl}/api/employees/count`),
          axios.get(`${backendUrl}/api/leads/conversion-rate`),
          axios.get(`${backendUrl}/api/leads/sales-data`),
          axios.get(`${backendUrl}/api/employees/`)
        ]);

        setUnassignedCount(unassignedRes.data.unassignedLeads);
        setAssignedThisWeek(assignedWeekRes.data.leadsAssignedThisWeek);
        setEmployeeCount(empCountRes.data.employeeCount);
        setConversionRate(conversionRes.data.conversionRate);
        setSalesData(salesRes.data);
        setEmployees(employeesRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <div className='dashboard'>
      {loading ? (
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Data is fetching from backend...</p>
        </div>
      ) : (
        <>
      <div className="heading">
        <p>Home &gt; Dashboard</p>
        <div className="cards">
          <DashboardCard img={card1Img} text="Unassigned Leads" number={unassignedCount} />
          <DashboardCard img={card2Img} text="Assigned This Week" number={assignedThisWeek} />
          <DashboardCard img={card3Img} text="Active Salespeople" number={employeeCount} />
          <DashboardCard img={card4Img} text="Conversion Rate" number={conversionRate} />
        </div>
        <div className="sales-chart-activity-feed">
          <div className="sales-chart">
            <SalesChart data={salesData} />
          </div>
          <div className="activity">
            <ActivityFeed />
          </div>
        </div>
        <div className="dash-employee-table">
          <EmployeeTable employees={employees} />
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default Dashboard;
