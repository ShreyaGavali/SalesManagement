// import React, { useEffect, useState } from 'react';
// import './Leads.css';
// import SearchFilter from '../../components/SearchFilter/SearchFilter';
// import LeadCard from '../../components/LeadCard/LeadCard';

// const Leads = () => {
//   const [leads, setLeads] = useState([]);
//   const [filteredLeads, setFilteredLeads] = useState([]);

//   useEffect(() => {
//     const fetchLeads = async () => {
//       const employeeId = localStorage.getItem('employeeId');
//       if (!employeeId) return;

//       try {
//         const res = await fetch(`http://localhost:8080/api/leads/${employeeId}`);
//         const data = await res.json();
//         setLeads(data);
//         setFilteredLeads(data);
//       } catch (err) {
//         console.error('Error fetching leads:', err);
//       }
//     };

//     fetchLeads();
//   }, []);

//    const handleFilterChange = (status) => {
//     if (!status) {
//       setFilteredLeads(leads);
//     } else {
//       setFilteredLeads(leads.filter(lead => lead.status === status));
//     }
//   };

//   return (
//     <div className='leads'>
//       <SearchFilter  filterOptions={['ongoing', 'closed']}
//         onFilterChange={handleFilterChange} />
//       <div className="leads-cards">
//         {filteredLeads.map((lead, index) => (
//           <LeadCard key={index} lead={lead} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Leads;

import React, { useEffect, useState } from 'react';
import './Leads.css';
import SearchFilter from '../../components/SearchFilter/SearchFilter';
import LeadCard from '../../components/LeadCard/LeadCard';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      const employeeId = localStorage.getItem('employeeId');
      if (!employeeId) return;

      try {
        const res = await fetch(`http://localhost:8080/api/leads/${employeeId}`);
        const data = await res.json();
        setLeads(data);
        setFilteredLeads(data);
      } catch (err) {
        console.error('Error fetching leads:', err);
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
    </div>
  );
};

export default Leads;

