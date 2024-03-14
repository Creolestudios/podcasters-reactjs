import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../../components/Header/AdminHeader';
import Sidebar from '../../components/Sidebar/AdminSidebar';

import '../../assets/scss/admin-layout.scss';

const AdminLayout: FC = () => (
  <div>
    <Header />
    <Sidebar />
    <div className='bottom-pattern admin-bottom-pattern admin-content'>
      <div className='admin-content-container'>
        <Outlet />
      </div>
    </div>
  </div>
);

export default AdminLayout;
