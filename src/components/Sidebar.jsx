// // import React, { useState } from 'react';
// // import {
// //   AppstoreOutlined,
// //   CalendarOutlined,
// //   LinkOutlined,
// //   MailOutlined,
// //   SettingOutlined,
// // } from '@ant-design/icons';
// // import { Divider, Menu, Switch } from 'antd';
// // const items = [
// //   {
// //     key: 'dashboard',
// //     icon: <MailOutlined />,
// //     label: (
// //       <a href="/cms/dashboard">
// //         Dashboard
// //       </a>
// //     ),
// //   },
// //   {
// //     key: 'ujian',
// //     icon: <CalendarOutlined />,
// //     label: 'Ujian',
// //   },
// //   {
// //     key: 'management-role',
// //     label: 'Management Role',
// //     icon: <AppstoreOutlined />,
// //     children: [
// //       {
// //         key: 'admin',
// //         label: 'Admin',
// //       },
// //       {
// //         key: 'guru',
// //         label: 'Guru',
// //       },
// //       {
// //         key: 'wali-kelas',
// //         label: 'Wali Kelas',
// //       },
// //     ],
// //   },
// //   {
// //     key: 'mata-pelajaran',
// //     icon: <MailOutlined />,
// //     label: 'Mata Pelajaran',
// //   },
// //   {
// //     key: 'kelas',
// //     icon: <MailOutlined />,
// //     label: (
// //       <a href="/cms/kelas">
// //         Kelas
// //       </a>
// //     ),
// //   },
// //   {
// //     key: 'kelola-siswa',
// //     icon: <MailOutlined />,
// //     label: 'Kelola Siswa',
// //   },
// //   {
// //     key: 'link',
// //     icon: <LinkOutlined />,
// //     label: (
// //       <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
// //         Ant Design
// //       </a>
// //     ),
// //   },
// // ];
// // const Sidebar = () => {
// //   const [mode, setMode] = useState('inline');
// //   const [theme, setTheme] = useState('light');

// //   return (
// //     <>
// //       <Menu
// //         style={{
// //           width: "100%",
// //         }}
// //         defaultSelectedKeys={['dashboard']}
// //         defaultOpenKeys={['sub1']}
// //         mode={mode}
// //         theme={theme}
// //         items={items}
// //       />
// //     </>
// //   );
// // };
// // export default Sidebar;
// import React, { useState, useEffect } from 'react';
// import {
//   AppstoreOutlined,
//   CalendarOutlined,
//   LinkOutlined,
//   MailOutlined,
// } from '@ant-design/icons';
// import { Menu } from 'antd';
// import { useLocation, Link } from 'react-router-dom';

// const items = [
//   {
//     key: '/cms/dashboard',
//     icon: <MailOutlined />,
//     label: (
//       <Link to="/cms/dashboard">
//         Dashboard
//       </Link>
//     ),
//   },
//   {
//     key: '/cms/ujian',
//     icon: <CalendarOutlined />,
//     label: 'Ujian',
//   },
//   {
//     key: 'management-role',
//     label: 'Management Role',
//     icon: <AppstoreOutlined />,
//     children: [
//       {
//         key: '/cms/admin',
//         label: 'Admin',
//       },
//       {
//         key: '/cms/guru',
//         label: 'Guru',
//       },
//       {
//         key: '/cms/wali-kelas',
//         label: 'Wali Kelas',
//       },
//     ],
//   },
//   {
//     key: 'ujian',
//     label: 'Ujian',
//     icon: <AppstoreOutlined />,
//     children: [
//       {
//         key: '/cms/kuis',
//         label: (
//           <Link to="/cms/kuis">
//             Kuis
//           </Link>
//         ),
//       },
//       {
//         key: '/cms/ulangan-harian',
//         label: (
//           <Link to="/cms/ulangan-harian">
//             Ulangan Harian
//           </Link>
//         ),
//       },
//       {
//         key: '/cms/uts-uas',
//         label: (
//           <Link to="/cms/uts-uas">
//             UTS & UAS
//           </Link>
//         ),
//       },
//     ],
//   },
//   {
//     key: '/cms/mata-pelajaran',
//     icon: <MailOutlined />,
//     label: 'Mata Pelajaran',
//   },
//   {
//     key: '/cms/kelas',
//     icon: <MailOutlined />,
//     label: (
//       <Link to="/cms/kelas">
//         Kelas
//       </Link>
//     ),
//   },
//   {
//     key: '/cms/kelola-siswa',
//     icon: <MailOutlined />,
//     label: 'Kelola Siswa',
//   },
//   {
//     key: 'link',
//     icon: <LinkOutlined />,
//     label: (
//       <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
//         Ant Design
//       </a>
//     ),
//   },
// ];

// const Sidebar = () => {
//   const location = useLocation();
//   const [selectedKey, setSelectedKey] = useState(location.pathname);

//   useEffect(() => {
//     setSelectedKey(location.pathname);
//   }, [location.pathname]);

//   return (
//     <>
//       <Menu
//         style={{
//           width: "100%",
//         }}
//         selectedKeys={[selectedKey]}
//         mode="inline"
//         theme="light"
//         items={items}
//       />
//     </>
//   );
// };

// export default Sidebar;

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
  // {
  //   key: '/cms/ujian',
  //   icon: <CalendarOutlined />,
  //   label: 'Ujian',
  // },
  {
    key: 'management-role',
    label: 'Management Role',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: '/cms/admin',
        label: 'Admin',
      },
      {
        key: '/cms/guru',
        label: 'Guru',
      },
      {
        key: '/cms/wali-kelas',
        label: 'Wali Kelas',
      },
    ],
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
    key: '/cms/mata-pelajaran',
    icon: <MailOutlined />,
    label: 'Mata Pelajaran',
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
    key: '/cms/kelola-siswa',
    icon: <MailOutlined />,
    label: 'Kelola Siswa',
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
