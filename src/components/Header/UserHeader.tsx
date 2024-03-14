import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import { connect } from 'react-redux';

import { getUser } from '../../redux/selectors/user';
import ButtonWrapper from '../form/ButtonWrapper';
import {
  PODCASTER_APP_ROUTES as PODCASTER,
  LISTENER_APP_ROUTES as LISTENER,
  ADMIN_APP_ROUTES as ADMIN,
  OPEN_APP_ROUTES,
} from '../../constant/appRoute';
import NavbarMenu from './NavbarMenu';
import { clearLocalStorage, getHost, getUserTitle } from '../../utils';

import LogoWhite from '../../assets/svg/LogoWhite';
import { IState } from '../../redux/types';
import { IUser, INavMenuItem, INavMenuDropdownItem } from '../../types';

import './user-header.scss';
import { APP_HOST } from '../../constant';

import GlobalSearchInput from '../GlobalSearch/GlobalSearchInput';
import IconButtonWrapper from '../IconButtonWrapper';
import SvgIcons from '../../assets/svg/SvgIcons';
import { setSearchQueryAction } from '../../redux/actions/listener/listener';
import { getPageSize } from '../../redux/selectors/listener/listener';

interface IProps {
  user: IUser;
  menuItems: INavMenuItem[] | null;
  menuDropdownItems: INavMenuDropdownItem[] | null;
  handleHostChange: (value: string) => void;
  setSearchQuery: (value: string) => void;
  pageSize: number;
}

const UserHeader: React.FC<IProps> = ({
  user,
  menuItems,
  menuDropdownItems,
  handleHostChange,
  setSearchQuery,
  pageSize,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('accessToken');
  const [searchParams, setSearchParams] = useSearchParams();
  const createProfile = location.pathname.includes('/create-profile');
  const onLogin = () => navigate(OPEN_APP_ROUTES.LOGIN);
  const [searchBar, setSearchBar] = useState<boolean>(false);
  const handleSearchParams = (query: string, page: string, size: string) => {
    setSearchParams(`searchString=${query}&page=${page}&size=${size}`);
  };
  const getSearchParams = (queryName: string) =>
    searchParams.get(queryName) ?? '';

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    handleSearchParams(
      query,
      getSearchParams('page') || '0',
      String(pageSize || 10)
    );
  };

  const handleSearchBar = (value: boolean) => setSearchBar(value);

  const onLogout = () => {
    if (getHost() === APP_HOST.PODCASTER) {
      clearLocalStorage();
      navigate(PODCASTER.LOGIN);
    } else if (getHost() === APP_HOST.ADMIN) {
      clearLocalStorage();
      navigate(ADMIN.LOGIN);
    } else {
      clearLocalStorage();
      navigate(OPEN_APP_ROUTES.LOGIN);
    }
  };

  const getRootUrl = () => {
    if (getHost() === APP_HOST.PODCASTER) {
      return `${PODCASTER.ROOT}?searchString=&page=0&size=10&sortColumn=id&sortDirection=desc`;
    }
    return '/';
  };

  function navInfo() {
    let renderContent;
    if (createProfile) {
      renderContent = (
        <>
          {/* eslint-disable-next-line */}
          <div
            className='overlay d-flex d-lg-none'
            onClick={() => {
              const navbarToggler = document.querySelector(
                '.navbar-toggler'
              ) as HTMLElement | null;
              if (navbarToggler) {
                navbarToggler.click();
              }
            }}
          />
          <div className='navbar-menu-container'>
            <div className='logo-mobile'>
              <Link
                to={getRootUrl()}
                onClick={() => {
                  handleSearch('');
                }}
              >
                <LogoWhite />
              </Link>
            </div>
          </div>
          <ButtonWrapper className='btn-nav logout' onClick={onLogout}>
            Logout
          </ButtonWrapper>
        </>
      );
    } else if (token && menuItems && menuDropdownItems) {
      renderContent = (
        <NavbarMenu
          navMenu={menuItems}
          navMenuDropdownItems={menuDropdownItems}
          userTitle={getUserTitle(user)}
          imageUrl={user.profilePhotoUrl}
          handleHostChange={handleHostChange}
        />
      );
    } else {
      renderContent = (
        <>
          {/* eslint-disable-next-line */}
          <div
            className='overlay d-flex d-lg-none'
            onClick={() => {
              const navbarToggler = document.querySelector(
                '.navbar-toggler'
              ) as HTMLElement | null;
              if (navbarToggler) {
                navbarToggler.click();
              }
            }}
          />
          <div className='moible-search m-r-16'>
            <GlobalSearchInput />
          </div>
          <div className='navbar-menu-container'>
            <div className='logo-mobile'>
              <Link
                to={getRootUrl()}
                onClick={() => {
                  handleSearch('');
                }}
              >
                <LogoWhite />
              </Link>
            </div>
          </div>
          <ButtonWrapper className='btn-nav login-btn' onClick={onLogin}>
            Login
          </ButtonWrapper>
        </>
      );
    }

    return renderContent;
  }

  return (
    <Navbar
      expand='lg'
      className={`bg-body-tertiary main-header ${
        location.pathname === '/podcaster/continue-edit' &&
        'audio-editor-header'
      }`}
    >
      {!searchBar ? (
        <Container className='container pb-0'>
          <Navbar.Brand className='cursor-pointer'>
            <Link
              to={getRootUrl()}
              onClick={() => {
                handleSearch('');
              }}
            >
              <LogoWhite />
            </Link>
          </Navbar.Brand>
          {getHost() !== APP_HOST.PODCASTER && (
            <IconButtonWrapper
              IconName={SvgIcons}
              iconType='search-icon'
              onClick={() => {
                setSearchBar(true);
              }}
              className='header-search-icon'
            />
          )}
          <Navbar.Toggle aria-controls='navbar-nav' />
          <Navbar.Collapse id='navbar-nav'>
            <Nav className='navbar-nav ms-auto d-flex align-items-start align-items-lg-center '>
              {navInfo()}
            </Nav>
          </Navbar.Collapse>
        </Container>
      ) : (
        <div className='moible-search'>
          <GlobalSearchInput isFromMobile handleSearchBar={handleSearchBar} />
        </div>
      )}
    </Navbar>
  );
};

const mapStateToProps = (state: IState) => ({
  user: getUser(state),
  pageSize: getPageSize(state),
});

const mapDispatchToProps = {
  setSearchQuery: setSearchQueryAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserHeader);
