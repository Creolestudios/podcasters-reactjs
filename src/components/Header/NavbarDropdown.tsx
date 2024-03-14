import React, { FC, useState } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import { clearLocalStorage, getHost } from '../../utils';
import ButtonWrapper from '../form/ButtonWrapper';
import { ADMIN_APP_ROUTES, OPEN_APP_ROUTES, PODCASTER_APP_ROUTES } from '../../constant/appRoute';
import { APP_HOST } from '../../constant';
import { userLogout } from '../../redux/actions/user';

import Logout from '../../assets/svg/Logout';
import ProfileIcon from '../../assets/svg/ProfileIcon';
import { INavMenuDropdownItem, IUser } from '../../types';
import './navbar-dropdown.scss';

export interface INavDropdownTitle {
  userTitle: string;
  imageUrl: string | null;
}

interface IProps extends INavDropdownTitle {
  items: INavMenuDropdownItem[];
  handleHostChange?: (value: string) => void;
  userLogout: () => void;
}

const NavDropdownTitle: FC<INavDropdownTitle> = ({ imageUrl, userTitle }) => (
  <span className='nav-dropdown-title-container'>
    {imageUrl ? (
      <img src={imageUrl} alt={userTitle} className='img-fluid rounded me-3' />
    ) : (
      <ProfileIcon />
    )}
    {userTitle}
  </span>
);

const NavbarDropdown: FC<IProps> = ({
  items,
  userTitle,
  imageUrl,
  handleHostChange,
  userLogout,
}) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleLogout = () => {
    if (getHost() === APP_HOST.PODCASTER) {
      userLogout();
      clearLocalStorage();
      navigate(PODCASTER_APP_ROUTES.LOGIN);
    } else if (getHost() === APP_HOST.ADMIN) {
      clearLocalStorage();
      navigate(ADMIN_APP_ROUTES.LOGIN);
    } else {
      clearLocalStorage();
      navigate(OPEN_APP_ROUTES.LOGIN);
    }
  };

  const getDivider = (index: number) => {
    if (getHost() === APP_HOST.ADMIN && index < items.length - 1) {
      return <NavDropdown.Divider />;
    }
    if (getHost() !== APP_HOST.ADMIN) {
      return <NavDropdown.Divider />;
    }
    return null;
  };

  return (
    <NavDropdown
      title={<NavDropdownTitle imageUrl={imageUrl} userTitle={userTitle} />}
      id='nav-dropdown'
      show={show}
      onToggle={(isOpen: boolean, metadata: any) => {
        if (metadata.source !== 'select') {
          setShow(isOpen);
        }
      }}
    >
      {items
        && items.length > 0
        && items.map((item: INavMenuDropdownItem, index: number) => (
          <>
            <Link to={item.url}>
              <ButtonWrapper
                key={item.title}
                className='dropdown-menu-item'
                onClick={() => {
                  setShow(false);
                  if (item.title === 'Home') {
                    localStorage.setItem('host', 'listener');
                    if (handleHostChange) handleHostChange('listener');
                  }
                }}
              >
                {item.iconType ? <item.Icon iconType={item.iconType} /> : <item.Icon />}
                {item.title}
              </ButtonWrapper>
            </Link>
            {getDivider(index)}
          </>
        ))}
      {getHost() !== APP_HOST.ADMIN && (
        <ButtonWrapper
          className='dropdown-item'
          onClick={handleLogout}
          Icon={Logout}
          isBaseCssRequired
        >
          Logout
        </ButtonWrapper>
      )}
    </NavDropdown>
  );
};

NavbarDropdown.defaultProps = {
  handleHostChange: () => {},
};

const mapDispatchToProps = {
  userLogout,
};

export default connect(null, mapDispatchToProps)(NavbarDropdown);
