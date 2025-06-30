// components/TableRowMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiEdit, FiTrash } from 'react-icons/fi';
import './TableRowMenu.css';

const TableRowMenu = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);

  return (
    <div className="menu-container" ref={menuRef}>
      <button className="menu-button" onClick={() => setOpen(!open)}>
        <FiMoreVertical size={18} />
      </button>
      {open && (
        <div className="menu-dropdown">
          <div className="menu-item" onClick={onEdit}>
            <FiEdit className="menu-icon" /> Edit
          </div>
          <div className="menu-item" onClick={onDelete}>
            <FiTrash className="menu-icon" /> Delete
          </div>
        </div>
      )}
    </div>
  );
};

export default TableRowMenu;
