import React, { useState, useEffect, useContext } from 'react';
import './LeadPage.css';
import LeadsTable from '../../components/LeadTable/LeadTable';
import UploadModal from '../../components/LeadUploadModal/UploadModal';
import axios from 'axios';
import { SearchContext } from '../../context/SearchContext.jsx';

const LeadPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [leads, setLeads] = useState([]);
  const { searchQuery } = useContext(SearchContext);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/leads/");
      const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
      setLeads(sorted);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    }finally {
    setLoading(false);
  }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

 const filteredLeads = leads.filter((lead) => {
  if (!searchQuery) return true; // ✅ Show all if searchQuery is empty

  const query = searchQuery.toLowerCase();

  return (
    lead.name?.toLowerCase().includes(query) ||
    lead.email?.toLowerCase().includes(query) ||
    lead.phone?.toLowerCase().includes(query) ||
    lead.status?.toLowerCase().includes(query) ||
    lead.type?.toLowerCase().includes(query) ||
    lead.language?.toLowerCase().includes(query) ||
    lead.location?.toLowerCase().includes(query) ||
    new Date(lead.receivedDate).toLocaleDateString().includes(query)
  );
});

  return (
    <div className='lead-page'>
      {loading ? (
      <div className="lead-loading">
        <div className="spinner"></div>
        <p>Data is fetching from backend...</p>
      </div>
    ) : (
      <>
      <div className="heading-add-btn">
        <div className="heading">
          <p>Home &gt; Leads</p>
        </div>
        <div className="add-btn">
          <button onClick={() => setShowModal(true)}>Add Lead</button>
        </div>
      </div>

      <div className="lead-table">
        <LeadsTable leads={filteredLeads} setLeads={setLeads} />
      </div>

      {showModal && (
        <UploadModal
          onClose={() => {
            setShowModal(false);
            fetchLeads(); // 🔄 Refresh leads after upload
          }}
        />
      )}
      </>
    )}
    </div>
  );
};

export default LeadPage;
