import React, { useState } from "react";
import "./LeadTable.css";
import { FiMoreVertical } from "react-icons/fi";

const LeadsTable = ({ leads, setLeads }) => {
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSort = () => {
    const sortedLeads = [...leads].sort((a, b) => {
      return sortAsc
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    });
    setLeads(sortedLeads);
    setSortAsc(!sortAsc);
  };

  return (
    <div className="leads-table-container">
      <table className="leads-table">
        <thead>
          <tr>
            <th onClick={toggleSort} style={{ cursor: "pointer" }}>
              Name {sortAsc ? (
                <i className="fa-solid fa-up-long"></i>
              ) : (
                <i className="fa-solid fa-down-long"></i>
              )}
            </th>
            <th>Email</th>
            <th>Phone</th>
            <th>Lead Date</th>
            <th>Status</th>
            <th>Type</th>
            <th>Language</th>
            <th>Location</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>{new Date(lead.receivedDate).toLocaleDateString()}</td>
              <td>{lead.status}</td>
              <td>{lead.type}</td>
              <td>{lead.language}</td>
              <td>{lead.location}</td>
              <td><div className="menu-icon" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
