import React, { useState, useEffect } from 'react';
import { AppstoreOutlined, CalendarOutlined, LinkOutlined, MailOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useLocation, Link } from 'react-router-dom';

const items = [
  {
    key: '/cms/dashboard',
    icon: <MailOutlined />,
    label: (
      <Link to="/cms/dashboard">
        Dashboard
      </Link>
    ),
  },
  {
    key: 'ujian',
    label: 'Ujian',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: '/cms/kuis',
        label: (
          <Link to="/cms/kuis">
            Kuis
          </Link>
        ),
      },
      {
        key: '/cms/ulangan-harian',
        label: (
          <Link to="/cms/ulangan-harian">
            Ulangan Harian
          </Link>
        ),
      },
      {
        key: '/cms/uts-uas',
        label: (
          <Link to="/cms/uts-uas">
            UTS & UAS
          </Link>
        ),
      },
    ],
  },
  {
    key: 'management-role',
    label: 'Management Role',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: '/cms/management-role/admin',
        label: (
          <Link to="/cms/management-role/admin">
            Admin
          </Link>
        ),
      },
      {
        key: '/cms/management-role/guru',
        label: (
          <Link to="/cms/management-role/guru">
            Guru
          </Link>
        ),
      },
      {
        key: '/cms/management-role/wali-kelas',
        label: (
          <Link to="/cms/management-role/wali-kelas">
            Wali Kelas
          </Link>
        ),
      },
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
    label: (
      <Link to="/cms/mata-pelajaran">
        Mata Pelajaran
      </Link>
    ),
  },
  {
    key: '/cms/kelas',
    icon: <MailOutlined />,
    label: (
      <Link to="/cms/kelas">
        Kelas
      </Link>
    ),
  },
  {
    key: '/cms/tambah-user',
    icon: <LinkOutlined />,
    label: (
      <Link to="/cms/tambah-user">
        Tambah User
      </Link>
    ),
  }
];

const Sidebar = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState('/cms/dashboard');

  const getFirstTwoPaths = (pathname) => {
    const paths = pathname.split('/');
    return `/${paths[1]}/${paths[2]}`;
  };


  useEffect(() => {
    const { pathname } = location;
    const firstTwoPaths = getFirstTwoPaths(pathname);
  
    setSelectedKey(firstTwoPaths);
  }, [location.pathname]);


  return (
    <>
      <Menu
        style={{ width: "100%" }}
        selectedKeys={[selectedKey]}
        mode="inline"
        theme="light"
        items={items}
      />
    </>
  );
};

export default Sidebar;
