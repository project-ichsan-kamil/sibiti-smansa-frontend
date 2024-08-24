import React, { useState, useEffect } from 'react';
import { AppstoreOutlined, LinkOutlined, MailOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import api from '../../config/axios';
import { Roles } from '../../config/enum';

const Sidebar = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState('/cms/dashboard');
  const [userRoles, setUserRoles] = useState([]);

  // Helper function to check if user has a specific role
  const hasRole = (role) => userRoles.includes(role);

  useEffect(() => {
    // Fetch roles from the backend
    api.get('/auth/me')
      .then((response) => {
        const { roles } = response.data;
        setUserRoles(roles);
      })
      .catch((err) => {
        console.error("Error fetching user roles:", err);
      });

    // Update selected menu key based on the current path
    const { pathname } = location;
    setSelectedKey(`/${pathname.split('/').slice(1, 3).join('/')}`);
  }, [location.pathname]);

  // Base items available to all users
  const baseItems = [
    {
      key: '/cms/dashboard',
      icon: <MailOutlined />,
      label: <Link to="/cms/dashboard">Dashboard</Link>,
    },
    {
      key: 'ujian',
      label: 'Ujian',
      icon: <AppstoreOutlined />,
      children: [
        { key: '/cms/kuis', label: <Link to="/cms/kuis">Kuis</Link> },
        { key: '/cms/ulangan-harian', label: <Link to="/cms/ulangan-harian">Ulangan Harian</Link> },
        { key: '/cms/uts-uas', label: <Link to="/cms/uts-uas">UTS & UAS</Link> },
      ],
    },
    {
      key: 'management-role',
      label: 'Management Role',
      icon: <AppstoreOutlined />,
      children: [
        { key: '/cms/management-role/admin', label: <Link to="/cms/management-role/admin">Admin</Link> },
        { key: '/cms/management-role/guru', label: <Link to="/cms/management-role/guru">Guru</Link> },
        { key: '/cms/management-role/wali-kelas', label: <Link to="/cms/management-role/wali-kelas">Wali Kelas</Link> },
      ],
    },
    {
      key: '/cms/kelola-siswa',
      icon: <MailOutlined />,
      label: 'Kelola Siswa',
    },
    {
      key: '/cms/mata-pelajaran',
      icon: <MailOutlined />,
      label: <Link to="/cms/mata-pelajaran">Mata Pelajaran</Link>,
    },
    {
      key: '/cms/kelas',
      icon: <MailOutlined />,
      label: <Link to="/cms/kelas">Kelas</Link>,
    },
  ];

  // Conditionally add items based on roles
  if (hasRole(Roles.SUPER_ADMIN)) {
    baseItems.push({
      key: '/cms/create-user',
      icon: <LinkOutlined />,
      label: <Link to="/cms/create-user">Create User</Link>,
    });
  }

  return (
    <Menu
      style={{ width: "100%" }}
      selectedKeys={[selectedKey]}
      mode="inline"
      theme="light"
      items={baseItems}
    />
  );
};

export default Sidebar;
