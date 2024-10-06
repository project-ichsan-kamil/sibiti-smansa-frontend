import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaHome, FaClipboardList, FaCalendarAlt, FaBook, FaUserCheck, FaCalendar, FaTimes } from 'react-icons/fa';
import image from '../../../assets/UserImage';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {

  const location = useLocation(); 

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaHome /> , hidden : true},
    { path: '/absensi', label: 'Absensi', icon: <FaUserCheck />, hidden: false},
    { path: '/kuis', label: 'Kuis', icon: <FaClipboardList />, hidden: true },
    { path: '/ulangan-harian', label: 'Ulangan Harian', icon: <FaClipboardList />, hidden: true},
    { path: '/ujian-tengah-semester', label: 'Ujian Tengah Semester', icon: <FaCalendarAlt />, hidden: true},
    { path: '/ujian-akhir-semester', label: 'Ujian Akhir Semester', icon: <FaCalendarAlt />, hidden: true},
    { path: '/jadwal-ujian', label: 'Jadwal Ujian', icon: <FaCalendar />, hidden: true},
    { path: '/bank-soal', label: 'Bank Soal', icon: <FaBook />, hidden: true},
  ];

  return (
    <div
      className={`fixed lg:static transform lg:translate-x-0 transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:w-60 h-screen bg-default shadow-lg lg:shadow-none flex-shrink-0 z-50`}
    >
      <div className="relative flex flex-col h-full p-4">
        
        <button 
          onClick={toggleSidebar} 
          className="absolute top-2 right-2 lg:hidden text-2xl p-2 focus:outline-none"
        >
          <FaTimes /> {/* Ikon Close */}
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center lg:py-8">
          <img 
            src={image.smansa} 
            alt="Logo" 
            className="h-16 lg:h-24 mb-4" 
          />
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-grow">
          <ul className='space-y-4'>
            {menuItems.map(({ path, label, icon, hidden}) => (
              <li
                key={path}
                className={`${hidden ? "hidden" : "flex"} items-center space-x-2 text-sm font-semibold p-2 px-4 rounded-lg transition-colors duration-300 ${
                  location.pathname.includes(path) ? 'bg-active text-white' : 'hover:bg-active hover:text-white' 
                }`}
              >
                {icon}
                <span>{label}</span>
              </li>
            ))}
          </ul>
            {/* <li className="items-center space-x-2 text-sm font-semibold rounded-lg p-2 px-4 hover:bg-active hover:text-white transition-colors duration-300 hidden">  //TODO show
              <FaHome />
              <span>Dashboard</span>
            </li>
            <li className="flex items-center space-x-2 text-sm font-semibold p-2 px-4 hover:bg-active hover:text-white rounded-lg transition-colors duration-300">
              <FaUserCheck />
              <span>Absensi</span>
            </li>
            <li className="flex items-center space-x-2 text-sm font-semibold p-2 px-4 hover:bg-active hover:text-white rounded-lg transition-colors duration-300">
              <FaClipboardList />
              <span>Kuis</span>
            </li>
            <li className="flex items-center space-x-2 text-sm font-semibold p-2 px-4 hover:bg-active hover:text-white  rounded-lg transition-colors duration-300">
              <FaClipboardList />
              <span>Ulangan Harian</span>
            </li>
            <li className="flex items-center space-x-2 text-sm font-semibold p-2 px-4 hover:bg-active hover:text-white rounded-lg transition-colors duration-300">
              <FaCalendarAlt />
              <span>Ujian Tengah Semester</span>
            </li>
            <li className="flex items-center space-x-2 text-sm font-semibold p-2 px-4 hover:bg-active hover:text-white rounded-lg transition-colors duration-300">
              <FaCalendarAlt />
              <span>Ujian Akhir Semester</span>
            </li>
            <li className="flex items-center space-x-2 text-sm font-semibold p-2 px-4 hover:bg-active hover:text-white rounded-lg transition-colors duration-300">
              <FaCalendar />
              <span>Jadwal Ujian</span>
            </li>
            <li className="flex items-center space-x-2 text-sm font-semibold p-2 px-4 hover:bg-active hover:text-white rounded-lg transition-colors duration-300">
              <FaBook />
              <span>Bank Soal</span>
            </li> */}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;


