import React from 'react';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import SvgIcons from '../../assets/svg/SvgIcons';
import { LINKEDIN_APP_ID as clientId, DOMAIN_URL } from '../../clientConfig';
import { linkedinLogin } from '../../services/user/User';
import { showToastMessage } from '../../utils';
import { TOASTER_STATUS } from '../../constant';

interface LinkedinLoginContainerProps {
  handleLinkedInLogin: CallableFunction;
}

const LinkedinLoginContainer = ({
  handleLinkedInLogin,
}: LinkedinLoginContainerProps) => {
  const responseLinkedin = async (response: any) => {
    try {
      const token = await linkedinLogin(response);
      if (!token.error) {
        handleLinkedInLogin(token);
      } else {
        showToastMessage(
          TOASTER_STATUS.ERROR,
          token.error?.txt || 'Something went wrong!',
        );
      }
    } catch (error: any) {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        error?.message || 'Something went wrong!',
      );
    }
  };

  const errorLinkedin = async (response: any) => {
    if (response?.errorMessage !== 'User closed the popup') {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        response?.errorMessage || 'Something went wrong!',
      );
    }
  };
  return (
    <div>
      <LinkedIn
        clientId={clientId ?? ''}
        redirectUri={`${DOMAIN_URL}linkedin`}
        scope='openid profile email'
        onError={errorLinkedin}
        onSuccess={responseLinkedin}
      >
        {({ linkedInLogin }) => (
          // eslint-disable-next-line
          <div
            className='social-media-btn d-flex align-items-center cursor-pointer'
            onClick={linkedInLogin}
          >
            <span className='social-icon'>
              <SvgIcons iconType='linkedin-icon' className='m-t-n6' />
            </span>
            <span className='w-100 d-flex justify-content-center'>
              Continue with Linkedin
            </span>
          </div>
        )}
      </LinkedIn>
    </div>
  );
};

export default LinkedinLoginContainer;
