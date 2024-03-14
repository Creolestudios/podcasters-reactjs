import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import SvgIcons from '../../assets/svg/SvgIcons';
import { googleLogin } from '../../services/user/User';
import { showToastMessage } from '../../utils';
import { TOASTER_STATUS } from '../../constant';

interface GoogleLoginContainerProps {
  handleGoogleLogin: CallableFunction;
}

const GoogleLoginContainer = ({
  handleGoogleLogin,
}: GoogleLoginContainerProps) => {
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await googleLogin(response);
        handleGoogleLogin(response.access_token);
      } catch (error: any) {
        showToastMessage(
          TOASTER_STATUS.ERROR,
          error?.message || 'Something went wrong!',
        );
      }
    },
  });
  return (
    /* eslint-disable-next-line */
    <div
      className='social-media-btn d-flex align-items-center cursor-pointer'
      onClick={() => login()}
    >
      <span className='social-icon'>
        <SvgIcons iconType='gmail-icon' className='mr-10' />
      </span>
      <span className='w-100 d-flex justify-content-center'>
        Continue with Gmail
      </span>
    </div>
  );
};

export default GoogleLoginContainer;
