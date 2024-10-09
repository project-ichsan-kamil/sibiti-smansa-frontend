import React, { useState, useEffect } from 'react';
import { AppstoreOutlined, LinkOutlined, MailOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import api from '../../config/axios';
import { Roles } from '../../config/enum';
import { AUTH_API } from '../../config/ApiConstants';

const Sidebar = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState('/cms/dashboard');
  const [userRoles, setUserRoles] = useState([]);

  // Helper function to check if user has a specific role
  const hasRole = (role) => userRoles.includes(role);

  // Helper function to check if user has any of the specified roles
  const hasAnyRole = (roles) => roles.some((role) => userRoles.includes(role));

  useEffect(() => {
    // Fetch roles from the backend
    api.get(AUTH_API.authMe)
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
      hide: true, // Example of adding hide property
    },
    {
      key: '/cms/kuis',
      icon: <AppstoreOutlined />,
      label: <Link to="/cms/kuis">Kuis</Link>,
      hide: true,
    },
    {
      key: '/cms/ulangan-harian',
      icon: <AppstoreOutlined />,
      label: <Link to="/cms/ulangan-harian">Ulangan Harian</Link>,
      hide: true,
    },
    {
      key: '/cms/uts',
      icon: <AppstoreOutlined />,
      label: <Link to="/cms/uts">UTS</Link>,
      hide: true,
    },
    {
      key: '/cms/uas',
      icon: <AppstoreOutlined />,
      label: <Link to="/cms/uas">UAS</Link>,
      hide: true,
    },
    {
      key: '/cms/kelola-siswa',
      icon: <MailOutlined />,
      label: 'Kelola Siswa',
      hide: true,
    },
  ];

  // Conditionally add "Mata Pelajaran" and "Kelas" for SUPER_ADMIN
  if (hasRole(Roles.SUPER_ADMIN)) {
    baseItems.push(
      {
        key: '/cms/mata-pelajaran',
        icon: <MailOutlined />,
        label: <Link to="/cms/mata-pelajaran">Mata Pelajaran</Link>,
        hide: false,
      },
      {
        key: '/cms/kelas',
        icon: <MailOutlined />,
        label: <Link to="/cms/kelas">Kelas</Link>,
        hide: false,
      }
    );
  }

  // Conditionally add Management Role items based on roles
  if (hasAnyRole([Roles.ADMIN, Roles.SUPER_ADMIN])) {
    const managementRoleItems = [
      { key: '/cms/management-role/guru', label: <Link to="/cms/management-role/guru">Guru</Link>, hide: false },
    ];

    if (hasRole(Roles.SUPER_ADMIN)) {
      managementRoleItems.unshift({ key: '/cms/management-role/admin', label: <Link to="/cms/management-role/admin">Admin</Link>, hide: false });
    }

    baseItems.push({
      key: 'management-role',
      label: 'Management Role',
      icon: <AppstoreOutlined />,
      children: managementRoleItems,
    });
  }

  // Conditionally add Create User item for SUPER_ADMIN
  if (hasRole(Roles.SUPER_ADMIN)) {
    baseItems.push({
      key: '/cms/create-user',
      icon: <LinkOutlined />,
      label: <Link to="/cms/create-user">Create User</Link>,
      hide: false,
    });
  }

  // Add Absensi menu with submenus for Guru and Siswa
  const absensiItems = {
    key: '/cms/absensi',
    icon: <AppstoreOutlined />,
    label: 'Absensi',
    children: [
      {
        key: '/cms/absensi/guru',
        label: <Link to="/cms/absensi/guru">Guru</Link>,
        hide: !hasAnyRole([Roles.ADMIN, Roles.SUPER_ADMIN]), // Only accessible by SUPER_ADMIN and ADMIN
      },
      {
        key: '/cms/absensi/siswa',
        label: <Link to="/cms/absensi/siswa">Siswa</Link>,
        hide: !hasAnyRole([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.GURU]), // Accessible by SUPER_ADMIN, ADMIN, and GURU
      },
    ],
  };

  // Check if Absensi item should be visible
  if (absensiItems.children.some(item => !item.hide)) {
    baseItems.push(absensiItems);
  }

  // Filter out items that should be hidden
  const visibleItems = baseItems.filter(item => !item.hide);
  
  // Filter children of Absensi menu
  visibleItems.forEach(item => {
    if (item.children) {
      item.children = item.children.filter(child => !child.hide);
    }
  });

  return (
    <Menu
      style={{ width: "100%" }}
      selectedKeys={[selectedKey]}
      mode="inline"
      theme="light"
      items={visibleItems}
    />
  );
};

export default Sidebar;

