import React, { useState, useEffect, FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import ButtonWrapper from '../form/ButtonWrapper';
import NavbarDropdown from './NavbarDropdown';
import { formatText, getUserTitle } from '../../utils';
import { NAV_DROPDOWN_ITEM } from '../../constant';

import './admin-header.scss';
import { IState } from '../../redux/types';
import { getUser } from '../../redux/selectors/user';
import { IUser } from '../../types';
import IconButtonWrapper from '../IconButtonWrapper';
import LeftArrow from '../../assets/svg/LeftArrow';
import { ADMIN_APP_ROUTES } from '../../constant/appRoute';

interface IProps {
  user: IUser;
}

const AdminHeader: FC<IProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [breadcrumb, setBreadcrumb] = useState<string>('');

  useEffect(() => {
    const breadecrumbText = location?.state?.headerTitle
      ? location?.state?.headerTitle
      : location.pathname.split('/')[2];
    setBreadcrumb(breadecrumbText);
  }, [location]);

  return (
    <header className='d-flex justify-content-between align-items-center admin-header'>
      {location?.state?.headerTitle
        ? breadcrumb
          && breadcrumb !== '' && (
            <h3 className='m-l-10'>
              <IconButtonWrapper
                className='pt-0'
                IconName={LeftArrow}
                onClick={() => navigate(-1)}
              />
              {formatText(breadcrumb)}
            </h3>
        )
        : breadcrumb
          && breadcrumb !== '' && (
            <h3 className='text-capitalize'>
              {formatText(breadcrumb).replace('-', ' ')}
            </h3>
        )}
      <div className='navbar-nav'>
        <div className='d-flex flex-row align-items-center'>
          {location.pathname
            === `${ADMIN_APP_ROUTES.ROOT}/${ADMIN_APP_ROUTES.DASHBOARD}` && (
            <ButtonWrapper className='btn-bg mr-20' onClick={() => {}}>
              Generate Report
            </ButtonWrapper>
          )}
          <NavbarDropdown
            items={NAV_DROPDOWN_ITEM.ADMIN}
            userTitle={getUserTitle(user)}
            imageUrl={user?.profilePhotoUrl}
          />
        </div>
      </div>
    </header>
  );
};

const mapStateToProps = (state: IState) => ({
  user: getUser(state),
});

export default connect(mapStateToProps, null)(AdminHeader);
