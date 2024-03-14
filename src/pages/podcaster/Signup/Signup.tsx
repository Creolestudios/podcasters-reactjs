import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  facebookLogin,
  googleLogin,
  linkedinLogin,
  signupPodcasterService,
} from '../../../services/podcaster/Auth';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import { APP_HOST, SUCCESS_MESSAGE, TOASTER_STATUS } from '../../../constant';
import { PODCASTER_APP_ROUTES } from '../../../constant/appRoute';
import { ISignup } from '../../../types/auth';

import Register from '../../../components/Register/Register';
import { setDataInLocalStorage, showToastMessage } from '../../../utils';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoading = (value: boolean) => setIsLoading(value);

  const handleRegister = (values: ISignup) => {
    handleLoading(true);
    signupPodcasterService(
      values,
      SUCCESS_MESSAGE.USER_SIGN_UP,
      handleLoading,
      (url: string) => navigate(url),
    );
  };

  const handleLogin = (
    loginFunction: (token: string) => Promise<any>,
    token: string,
  ) => {
    loginFunction(token)
      .then((response) => {
        setDataInLocalStorage(response?.data?.result);
        localStorage.setItem('host', APP_HOST.PODCASTER);
        if (response?.data?.result?.userProfileCompleted) {
          navigate(`${PODCASTER_APP_ROUTES.ROOT}`);
        } else {
          navigate(
            `${PODCASTER_APP_ROUTES.ROOT}/${PODCASTER_APP_ROUTES.CREATE_PROFILE}`,
          );
        }
      })
      .catch((error) => {
        showToastMessage(
          TOASTER_STATUS.ERROR,
          error?.message || 'Something went wrong!',
        );
      });
  };

  return (
    <div>
      {isLoading && <FullPageLoader isScreenExist />}
      <Register
        handleRegister={handleRegister}
        path={`/${PODCASTER_APP_ROUTES.LOGIN}`}
        handleGoogleLogin={(token: string) => handleLogin(googleLogin, token)}
        handleFacebookLogin={(token: string) => handleLogin(facebookLogin, token)}
        handleLinkedInLogin={(token: string) => handleLogin(linkedinLogin, token)}
      />
    </div>
  );
};

export default SignupPage;