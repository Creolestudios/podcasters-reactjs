import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import ButtonWrapper from '../form/ButtonWrapper';
import { ADMIN_SIDEBAR_MENU } from '../../constant';
import LogoWhite from '../../assets/svg/LogoWhite';
import SvgIcons from '../../assets/svg/SvgIcons';

import './admin-sidebar.scss';
import { ADMIN_APP_ROUTES } from '../../constant/appRoute';
import { clearLocalStorage } from '../../utils';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const onLogout = () => {
    clearLocalStorage();
    navigate(ADMIN_APP_ROUTES.LOGIN);
  };

  return (
    <div className='leftside-menu'>
      <LogoWhite />

      <ul>
        {ADMIN_SIDEBAR_MENU
          && ADMIN_SIDEBAR_MENU.length > 0
          && ADMIN_SIDEBAR_MENU.map((item: any) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={({ isActive }) => `sidebar-menu-item ${isActive ? 'active' : ''}`}
            >
              <li className='text-nowrap'>
                <SvgIcons iconType={item.iconType} />
                {item.title}
              </li>
            </NavLink>
          ))}
      </ul>

      <div className='btn-block'>
        <ButtonWrapper className='w-100 btn-bg' onClick={onLogout}>
          Logout
        </ButtonWrapper>
      </div>
    </div>
  );
};

export default AdminSidebar;
