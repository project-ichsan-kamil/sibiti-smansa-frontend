import React from 'react';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';

const { Header } = Layout;

const Navbar = () => {
  const menu = (
    <Menu>
        <Menu.Item key="logout">Dashboard</Menu.Item>
      <Menu.Item key="profile">Profile</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  return (
    <Header className="bg-purple-700 flex justify-between items-center w-full">
      <div>
        <h1 className='text-white text-2xl font-semibold'>Smansa</h1>
      </div>
      <Dropdown overlay={menu} placement="bottomRight">
        <Avatar icon={<UserOutlined />} style={{ float: 'right', marginRight: '20px', cursor: 'pointer' }} />
      </Dropdown>
    </Header>
  );
}

export default Navbar;
