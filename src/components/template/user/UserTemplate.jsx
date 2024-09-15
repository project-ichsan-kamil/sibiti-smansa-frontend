import React, { useState } from 'react';
import { FaBell, FaUser, FaHome, FaClipboardList, FaCalendarAlt, FaBook, FaBars } from 'react-icons/fa';
import Sidebar from './Sidebar';

const UserTemplate = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false); 
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false); 
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-grow bg-white">
        {/* Navbar */}
        <div className="flex items-center justify-between p-4 bg-white shadow-lg">
          <button onClick={toggleSidebar} className="lg:hidden text-2xl">
            <FaBars />
          </button>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaBell className="text-2xl cursor-pointer" onClick={toggleNotification} />
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4">
                  <p className="font-semibold">Notifikasi</p>
                  <ul className="mt-2 space-y-2">
                    <li className="border-b pb-2">Masuk ke Akun Anda</li>
                    <li className="border-b pb-2">Ujian Linear Dua Variabel</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="relative">
              <FaUser className="text-2xl cursor-pointer" onClick={toggleProfile} />
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4">
                  <p className="font-semibold">Profile</p>
                  <ul className="mt-2 space-y-2">
                    <li>Data Diri</li>
                    <li>Ubah Password</li>
                    <li>Keluar</li>
                  </ul>
                </div>
              )}
            </div>

            <img
              src="/path-to-avatar"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>

        {/* Content area */}
        <div className="p-4 overflow-auto">
          {children} {/* Render content passed as children */}
        </div>
      </div>
    </div>
  );
};

export default UserTemplate;
