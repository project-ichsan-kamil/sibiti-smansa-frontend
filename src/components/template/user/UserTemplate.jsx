import React, { useState } from 'react';
import { FaBell, FaUser, FaHome, FaClipboardList, FaCalendarAlt, FaBook, FaBars } from 'react-icons/fa';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const UserTemplate = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-grow bg-white">

        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Content area */}
        <div className="p-4 overflow-auto">
          {children} {/* Render content passed as children */}
        </div>
      </div>
    </div>
  );
};

export default UserTemplate;
