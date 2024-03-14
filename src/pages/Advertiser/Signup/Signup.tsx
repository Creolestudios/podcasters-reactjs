import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import { APP_HOST, SUCCESS_MESSAGE, TOASTER_STATUS } from '../../../constant';
import { ADVERTISER_APP_ROUTES } from '../../../constant/appRoute';
import { ISignup } from '../../../types/auth';
import Register from '../../../components/Register/Register';
import {
  facebookLogin,
  googleLogin,
  linkedinLogin,
  signupAdvertiserService,
} from '../../../services/Advertiser/Auth';
import { setDataInLocalStorage, showToastMessage } from '../../../utils';

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoading = (value: boolean) => setIsLoading(value);

  const handleRegister = (values: ISignup) => {
    handleLoading(true);
    signupAdvertiserService(
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
        localStorage.setItem('host', APP_HOST.ADVERTISER);
        if (response?.data?.result?.userProfileCompleted) {
          navigate(`${ADVERTISER_APP_ROUTES.ROOT}`);
        } else {
          navigate(
            `${ADVERTISER_APP_ROUTES.ROOT}/${ADVERTISER_APP_ROUTES.CREATE_PROFILE}`,
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
        handleGoogleLogin={(token: string) => handleLogin(googleLogin, token)}
        handleFacebookLogin={(token: string) => handleLogin(facebookLogin, token)}
        handleLinkedInLogin={(token: string) => handleLogin(linkedinLogin, token)}
        path={`/${ADVERTISER_APP_ROUTES.LOGIN}`}
      />
    </div>
  );
};

export default SignupPage;