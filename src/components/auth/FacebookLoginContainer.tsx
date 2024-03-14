import React from 'react';
import FacebookLogin from 'react-facebook-login';
import SvgIcons from '../../assets/svg/SvgIcons';
import { showToastMessage } from '../../utils';
import { FACEBOOK_APP_ID as appId } from '../../clientConfig';
import { TOASTER_STATUS } from '../../constant';

interface FacebookLoginContainerProps {
  handleFacebookLogin: CallableFunction;
}

const FacebookLoginContainer = ({ handleFacebookLogin }: FacebookLoginContainerProps) => {
  const login = async (response: any) => {
    if (response?.accessToken) {
      try {
        if (response?.email) {
          handleFacebookLogin(response.accessToken);
        } else {
          showToastMessage(
            TOASTER_STATUS.ERROR,
            'Please add email address first in your social account',
          );
        }
      } catch (err: any) {
        showToastMessage(TOASTER_STATUS.ERROR, err?.message || 'Something went wrong!');
      }
    }
  };

  return (
    <FacebookLogin
      appId={appId ?? ''}
      fields='name,email,picture'
      cssClass='facebook-login-container'
      callback={login}
      icon={(
        <div className='social-media-btn d-flex align-items-center'>
          <span className='social-icon'>
            <SvgIcons iconType='facebook-icon' className='mr-10 m-t-n3' />
          </span>
          <span className='w-100 d-flex justify-content-center'>Continue with Facebook</span>
        </div>
      )}
      textButton=''
    />
  );
};

export default FacebookLoginContainer;
