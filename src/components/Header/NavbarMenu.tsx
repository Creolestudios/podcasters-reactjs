import React from 'react';
import {
  useSearchParams, NavLink, useLocation, useNavigate,
} from 'react-router-dom';

import { connect } from 'react-redux';
import NavbarDropdown, { INavDropdownTitle } from './NavbarDropdown';

import { INavMenuDropdownItem, INavMenuItem, IUser } from '../../types';
import './navbar-menu.scss';
import { IState } from '../../redux/types';
import { setSearchQueryAction } from '../../redux/actions/listener/listener';
import { getPageSize } from '../../redux/selectors/listener/listener';

import { APP_HOST, USER_ROLE } from '../../constant';
import { getHost, getLocalStorage, setLocalStorage } from '../../utils';
import GlobalSearchInput from '../GlobalSearch/GlobalSearchInput';
import ButtonWrapper from '../form/ButtonWrapper';
import LogoWhite from '../../assets/svg/LogoWhite';
import { PODCASTER_APP_ROUTES } from '../../constant/appRoute';
import { getUser } from '../../redux/selectors/user';

interface IProps extends INavDropdownTitle {
  navMenu: INavMenuItem[];
  navMenuDropdownItems: INavMenuDropdownItem[];
  setSearchQuery: (query: string) => void;
  pageSize: number;
  handleHostChange: (value: string) => void;
  user: IUser;
}

const NavbarMenu: React.FC<IProps> = ({
  navMenu,
  navMenuDropdownItems,
  userTitle,
  imageUrl,
  setSearchQuery,
  pageSize,
  handleHostChange,
  user,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const ROLES = getLocalStorage('roles');
  const getSearchParams = (queryName: string) => searchParams.get(queryName) ?? '';
  const handleSearchParams = (query: string, page: string, size: string) => {
    setSearchParams(`searchString=${query}&page=${page}&size=${size}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    handleSearchParams(query, getSearchParams('page') || '0', String(pageSize || 10));
  };

  const handleStyle = (url: string) => (location.pathname === url ? 'nav-item active-menu' : 'nav-item');
  const getRootUrl = () => {
    if (getHost() === APP_HOST.PODCASTER) {
      return `${PODCASTER_APP_ROUTES.ROOT}?searchString=&page=0&size=10&sortColumn=id&sortDirection=desc`;
    }
    return '/';
  };

  return (
    <div>
      {/* eslint-disable-next-line */}
      <div
        className='overlay d-flex d-lg-none'
        onClick={() => {
          const navbarToggler = document.querySelector('.navbar-toggler') as HTMLElement | null;
          if (navbarToggler) {
            navbarToggler.click();
          }
        }}
      />
      <ul className='navbar-menu-container d-block d-lg-flex align-items-start align-items-lg-center navbar-nav w-100'>
        <li className='logo-mobile'>
          <NavLink
            onClick={() => {
              handleSearch('');
            }}
            to={getRootUrl()}
          >
            <LogoWhite />
          </NavLink>
        </li>
        {navMenu.map((menu: INavMenuItem) => (
          <li
            className={`nav-item ${
              getHost() === APP_HOST.PODCASTER
              && !user?.activePlanUuidAndEndDate
              && menu.title !== 'My Subscription Plan'
              && 'link-disabled d-none'
            }`}
          >
            <NavLink
              to={menu.url}
              key={menu.title}
              onClick={(e) => {
                if (
                  getHost() === APP_HOST.PODCASTER
                  && !user?.activePlanUuidAndEndDate
                  && menu.title !== 'My Subscription Plan'
                ) {
                  e?.preventDefault();
                  handleSearch('');
                }
              }}
              className={() => handleStyle(menu.url)}
            >
              {menu.title}
            </NavLink>
          </li>
        ))}
        {getHost() !== APP_HOST.PODCASTER && <GlobalSearchInput />}
        {getHost() === APP_HOST.LISTENER && ROLES.includes(USER_ROLE.PODCASTER) && (
          <ButtonWrapper
            className='manage-podcast-btn'
            onClick={() => {
              localStorage.setItem('host', 'podcaster');
              navigate('/podcaster', { state: { isFromListener: true } });
              handleHostChange('podcaster');
            }}
          >
            Manage Podcast
          </ButtonWrapper>
        )}

        <NavbarDropdown
          items={navMenuDropdownItems}
          userTitle={userTitle}
          imageUrl={imageUrl}
          handleHostChange={handleHostChange}
        />
      </ul>
    </div>
  );
};
const mapStateToProps = (state: IState) => ({
  pageSize: getPageSize(state),
  user: getUser(state),
});

const mapDispatchToProps = {
  setSearchQuery: setSearchQueryAction,
};
export default connect(mapStateToProps, mapDispatchToProps)(NavbarMenu);
