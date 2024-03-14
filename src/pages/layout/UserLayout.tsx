import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';

import UserHeader from '../../components/Header/UserHeader';
import { APP_HOST, NAV_MENU_ITEM, NAV_DROPDOWN_ITEM } from '../../constant';
import AudioPlayerWrapper from '../../components/AudioPlayerWrapper';
import { IState } from '../../redux/types';
import { PODCASTER_APP_ROUTES as PODCASTER_ROUTES } from '../../constant/appRoute';
import { getEditorEpisodeCount } from '../../redux/selectors/user';
import { getUserDetailAction } from '../../redux/actions/user';
import FullPageLoader from '../../components/Loader/FullPageLoader';

interface IProps {
  editorEpisodeCount: number;
  getUserDetailAction: (host: string, handleLoading: CallableFunction) => void;
}

const UserLayout: React.FC<IProps> = ({ editorEpisodeCount, getUserDetailAction }) => {
  const location = useLocation();
  const HOST = localStorage.getItem('host') || '';
  const [host, setHost] = useState<string>(HOST);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoading = (value: boolean) => setIsLoading(value);

  const handleHostChange = (value: string) => {
    setHost(value);
    handleLoading(true);
    getUserDetailAction(value, handleLoading);
  };

  const getNavbarData = () => {
    switch (host) {
      case APP_HOST.PODCASTER:
        return {
          menuItems:
            editorEpisodeCount > 0
              ? [
                ...NAV_MENU_ITEM.PODCASTER,
                {
                  url: `${PODCASTER_ROUTES.ROOT}/${PODCASTER_ROUTES.CONTINUE_EDIT}`,
                  title: 'Continue Editing',
                },
              ]
              : NAV_MENU_ITEM.PODCASTER,
          menuDropdownItems: NAV_DROPDOWN_ITEM.PODCASTER,
        };

      case APP_HOST.ADVERTISER:
        return {
          menuItems: NAV_MENU_ITEM.ADVERTISER,
          menuDropdownItems: NAV_DROPDOWN_ITEM.ADVERTISER,
        };

      case APP_HOST.LISTENER:
        return {
          menuItems: NAV_MENU_ITEM.LISTENER,
          menuDropdownItems: NAV_DROPDOWN_ITEM.LISTENER,
        };

      default:
        return {
          menuItems: null,
          menuDropdownItems: null,
        };
    }
  };

  return isLoading ? (
    <FullPageLoader />
  ) : (
    <>
      <UserHeader
        menuItems={getNavbarData().menuItems}
        menuDropdownItems={getNavbarData().menuDropdownItems}
        handleHostChange={handleHostChange}
      />
      <div
        className={
          location.pathname.split('/').at(-1) === PODCASTER_ROUTES.CONTINUE_EDIT
            ? ''
            : 'bottom-pattern'
        }
      >
        <Container className='user-content-container'>
          <Outlet />
        </Container>
      </div>
      <AudioPlayerWrapper />
    </>
  );
};

const mapStateToProps = (state: IState) => ({
  editorEpisodeCount: getEditorEpisodeCount(state),
});

const mapDispatchToProps = {
  getUserDetailAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserLayout);
