import React, { useState } from 'react';
import { FaBell, FaBars, FaChevronDown, FaUser, FaKey, FaSignOutAlt } from 'react-icons/fa';
import image from '../../../assets/UserImage';
import NotificationCard from './NotificationCard';
import { useNavigate } from 'react-router-dom';
import { showSuccessNotification, showErrorNotification } from '../Notification';
import Utils from '../../../utils/Utils';
import Loading from '../Loading';
import api from '../../../config/axios';
import { useAuthContext } from '../../../context/useContext';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate()
  const { currentUser } = useAuthContext();
  const {showLoading, hideLoading, loading} = Utils();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Misalnya ada 3 notifikasi

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false); // Close profile if notification is opened
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false); // Close notification if profile is opened
  };

  const handleLogout = () => {
    showLoading()
    api.post("/auth/logout")
      .then(() => {
        showSuccessNotification("Logout berhasil", "Anda telah berhasil logout. Sampai jumpa lagi!" )
        
        navigate("/", { replace: true });
      })
      .catch((err) => {
        showErrorNotification(err, "Logout gagal, harap coba lagi" )
      })
      .finally(() => {
        hideLoading()
      });
  };

  return (
    <div className="flex items-center justify-between p-3 lg:px-20 bg-default shadow-sm">
      {/* Toggle Sidebar hanya muncul di mobile view */}
      <button onClick={toggleSidebar} className="lg:hidden text-xl">
        <FaBars />
      </button>

      {/* Heading Dashboard */}
      <h2 className="text-2xl font-bold"></h2>

      {/* Notification dan Profile */}
      <div className="flex items-center space-x-4">
        
        {/* Notifikasi */}
        <div className="relative">
          <div className="relative cursor-pointer hidden" onClick={toggleNotification}>     //TODO show
            <FaBell className="text-2xl" />
            {/* Badge jumlah notifikasi */}
            {notifications > 0 && (
              <div className="absolute top-0 right-0 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </div>
            )}
          </div>

          {/* Popup Notifikasi */}
          {isNotificationOpen && (
            <div className="absolute -left-36 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 z-50 max-w-xs"> 
                <h2 className="text-md font-semibold mb-2">Notifikasi</h2>
                <div className="space-y-2 max-h-80 overflow-y-auto lg:pr-2"> {/* Tambahkan max-h dan overflow-y-auto */}
                    <NotificationCard
                    title="Masuk ke Akun"
                    description="Kamu berhasil masuk ke akun kamu"
                    time="18 menit yang lalu"
                    />
                    <NotificationCard
                    title="Masuk ke Akun"
                    description="Kamu berhasil masuk ke akun kamu"
                    time="18 menit yang lalu"
                    />
                    <NotificationCard
                    title="Masuk ke Akun"
                    description="Kamu berhasil masuk ke akun kamu"
                    time="1 hari yang lalu"
                    />
                    <NotificationCard
                    title="Masuk ke Akun"
                    description="Kamu berhasil masuk ke akun kamu "
                    time="1 hari yang lalu"
                    />
                    <NotificationCard
                    title="Masuk ke Akun"
                    description="Kamu berhasil masuk ke akun kamu"
                    time="2 hari yang lalu"
                    />
                </div>
                </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <div className="flex items-center cursor-pointer" onClick={toggleProfile}>
            <img
              src={image.smansa} // Ganti dengan URL foto user
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <span className="ml-2 text-sm">{currentUser.fullName}</span> 
            <FaChevronDown className="ml-1 text-xs" /> {/* Ikon dropdown */}
          </div>
          
          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-fit bg-white shadow-lg rounded-lg p-4 z-50">
            <ul className="space-y-2">
              <li className="items-center space-x-2 p-2 text-sm rounded-lg hover:bg-active hover:text-white px-6 hidden">  //TODO show
                <FaUser />
                <span>Profile</span>
              </li>
              <li className="items-center space-x-2 p-2 text-sm rounded-lg hover:bg-active hover:text-white px-6 hidden">   //TODO show
                <FaKey />
                <span>Password</span>
              </li>
              <li className="flex items-center space-x-2 p-2 text-sm rounded-lg hover:bg-active hover:text-white px-6 border border-active hover:cursor-pointer"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>Keluar</span>
              </li>
            </ul>
          </div>
          )}
        </div>
      </div>

      {loading && <Loading/>}
    </div>
  );
};

export default Navbar;

