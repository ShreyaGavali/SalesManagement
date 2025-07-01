import React, { useEffect, useState } from 'react';
import './Leads.css';
import SearchFilter from '../../components/SearchFilter/SearchFilter';
import LeadCard from '../../components/LeadCard/LeadCard';

const Leads = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      const employeeId = localStorage.getItem('employeeId');
      if (!employeeId) return;

      try {
        const res = await fetch(`${backendUrl}/api/leads/${employeeId}`);
        const data = await res.json();
        setLeads(data);
        setFilteredLeads(data);
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
    setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  useEffect(() => {
    let tempLeads = [...leads];

    // Apply search
    if (searchText) {
      const text = searchText.toLowerCase();
      tempLeads = tempLeads.filter(lead =>
        lead.name.toLowerCase().includes(text) ||
        lead.email.toLowerCase().includes(text) ||
        lead.status.toLowerCase().includes(text) ||
        lead.type.toLowerCase().includes(text)
      );
    }

    // Apply filter
    if (filterValue) {
      tempLeads = tempLeads.filter(lead => lead.status === filterValue);
    }

    setFilteredLeads(tempLeads);
  }, [searchText, filterValue, leads]);

  return (
    <div className='leads'>
       {loading ? (
      <div className="loader-container">
        <div className="spinner" />
        <p className="loading-text">Data is fetching from backend...</p>
      </div>
    ) : (
      <>
      <SearchFilter
        filterOptions={['ongoing', 'closed']}
        onFilterChange={setFilterValue}
        onSearch={setSearchText}
      />
      <div className="leads-cards">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead, index) => (
            <LeadCard key={index} lead={lead} />
          ))
        ) : (
          <p>No leads found.</p>
        )}
      </div>
      </>
    )}
    </div>
  );
};

export default Leads;

