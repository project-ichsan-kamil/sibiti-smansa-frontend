import React, { useEffect, useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, message, notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios'; // Pastikan path ini benar
import { Roles } from '../../config/enum';
import { AUTH_API } from '../../config/ApiConstants';

const { Header } = Layout;

const NavbarAdmin = () => {
  const [userData, setUserData] = useState({ fullname: '', role: '' });
  const navigate = useNavigate();

  useEffect(() => {
    api.get(AUTH_API.authMe)
      .then((response) => {
        const { fullName, roles } = response.data;
        const primaryRole = roles.includes('ADMIN') ? 'ADMIN' : roles[0];
        setUserData({ fullname: fullName, role: primaryRole });
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        message.error("Failed to fetch user data.");
      });
  }, []);

  const handleLogout = () => {
    api.post(AUTH_API.logout)
      .then(() => {
        notification.success({
          message: "Logout Successful",
          description: "You have successfully logged out. See you next time!",
        });
        
        navigate("/login", { replace: true });
      })
      .catch((err) => {
        notification.error({
          message: "Logout failed",
          description: "Please try again.",
        });
        console.error("Logout error:", err);
      });
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'dashboard') {
      // Redirect based on the user's role
      if (['ADMIN', 'SUPER_ADMIN', 'GURU'].includes(userData.role)) {
        navigate('/cms/dashboard');
      } else if (userData.role === 'SISWA') {
        navigate('/dashboard');
      } else {
        message.error("You do not have access to the dashboard.");
      }
    } else if (key === 'profile') {
      navigate('/profile');
    } else if (key === 'logout') {
      handleLogout();
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="dashboard">Dashboard</Menu.Item>
      <Menu.Item key="profile">Profile</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  return (
    <Header className="bg-purple-700 flex justify-between items-center w-full">
      <div>
        <h1 className="text-white text-2xl font-semibold">Smansa</h1>
      </div>
      <div className="flex items-center">
        {/* Display Fullname and Role */}
        <Dropdown overlay={menu} trigger={['hover']} placement="bottomRight">
          <div className="flex items-center cursor-pointer">
            <Avatar
              icon={<UserOutlined />}
              style={{ cursor: 'pointer', backgroundColor: '#87d068', marginRight: '12px' }}
            />
            <div className="text-white mr-2" style={{ lineHeight: 1.2 }}>
              <p className="mb-0 font-semibold" style={{ marginBottom: '2px' }}>{userData.fullname}</p>
              <p className="mb-0 text-xs" style={{ marginTop: '0', marginBottom: '0' }}>
                {userData.role === Roles.SUPER_ADMIN ? "SUPER ADMIN" : userData.role}
              </p>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default NavbarAdmin;

