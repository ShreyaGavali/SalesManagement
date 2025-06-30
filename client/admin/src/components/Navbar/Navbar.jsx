import React, { useContext } from 'react';
import './Navbar.css';
import searchImg from '../../assets/Search-Icon.png';
import { SearchContext } from '../../context/SearchContext.jsx';

const Navbar = () => {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  return (
    <div className='navbar'>
        <div className="search-bar">
            <img src={searchImg} alt="" />
            <input type="text" placeholder='Search here....' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
    </div>
  )
}

export default Navbar