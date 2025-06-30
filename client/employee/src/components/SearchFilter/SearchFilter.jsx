import React, { useState } from 'react';
import './SearchFilter.css';
import searchImg from '../../assets/Search.png';
import filterImg from '../../assets/Vector6.png';
import { useRef, useEffect } from 'react';

const SearchFilter = ({ filterOptions = [], onFilterChange, onSearch }) => {
  const [showPopup, setShowPopup] = useState(false);
  const filterRef = useRef();

  const handleSearch = (e) => {
    onSearch(e.target.value);
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  return (
    <div className='search-filter'>
      <div className="search">
        <img src={searchImg} alt="search" />
        <input type="text" placeholder='Search' onChange={handleSearch} />
      </div>
      {filterOptions.length > 0 && (
        <div className="filter" ref={filterRef}>
          <img src={filterImg} alt="filter" onClick={() => setShowPopup(!showPopup)} />
          {showPopup && (
            <div className="filter-popup">
              <label>Filter</label>
              <select onChange={(e) => {
                onFilterChange(e.target.value);
                setShowPopup(false);
              }}>
                <option value="">All</option>
                {filterOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;

