import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./SalesChart.css";

const SalesChart = ({ data }) => {
  return (
    <div className="chart-container">
      <p className='sale-heading'>Sales Analytics</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip formatter={(value) => `${value} leads`} />
          <Bar dataKey="sales" fill="#c4c4c4" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;

