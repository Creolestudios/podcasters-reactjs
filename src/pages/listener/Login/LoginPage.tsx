import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import Login from '../../../components/Login/Login';
import { listenerLoginAction } from '../../../redux/actions/user';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import { APP_HOST, SUCCESS_MESSAGE, TOASTER_STATUS } from '../../../constant';
import {
  LISTENER_APP_ROUTES,
  OPEN_APP_ROUTES,
} from '../../../constant/appRoute';
import { ILogin } from '../../../types/auth';
import {
  facebookLogin,
  googleLogin,
  linkedinLogin,
  resendEmail,
  verifyListenerService,
} from '../../../services/listener/Auth';
import { setDataInLocalStorage, showToastMessage } from '../../../utils';
import ButtonWrapper from '../../../components/form/ButtonWrapper';

interface IProps {
  listenerLoginAction: (
    loginData: ILogin,
    handleLoading: (value: boolean) => void,
    onContinue: (userProfile: boolean) => void,
    handleResendEmail: (email: string) => void,
  ) => void;
}

const LoginPage: React.FC<IProps> = ({ listenerLoginAction }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoading = (value: boolean) => setIsLoading(value);

  const getVerifyRoute = () => {
    const path = LISTENER_APP_ROUTES.VERIFY.split(':')[0];
    const _path = path.slice(0, path.length - 1);

    return `/${_path}/${token}`;
  };

  const redirect = (path: string) => navigate(path);

  useEffect(() => {
    const pathName = location.pathname;

    if (token && pathName === getVerifyRoute()) {
      handleLoading(true);
      verifyListenerService(token, SUCCESS_MESSAGE.USER_ACTIVATION, handleLoading, redirect);
    }
  }, []);

  const onContinue = (userProfile: boolean) => {
    if (userProfile) {
      redirect(OPEN_APP_ROUTES.ROOT);
    } else {
      redirect(`/${OPEN_APP_ROUTES.CREATE_PROFILE}`);
    }
  };

  const handleResendEmail = (email: string) => showToastMessage(
    TOASTER_STATUS.ERROR,
    <div className='send-email-podcaster'>
      <div className='m-r-10'>
        Your account is not activated. please check your email for invitation
        mail.
      </div>
      <ButtonWrapper
        isBaseCssRequired
        className='send-email-podcaster-btn'
        onClick={() => {
          resendEmail(encodeURIComponent(email));
        }}
      >
        Resend Email
      </ButtonWrapper>
    </div>,
  );

  const handleLogin = (values: ILogin) => {
    handleLoading(true);
    listenerLoginAction(values, handleLoading, onContinue, handleResendEmail);
  };

  const handleSocialLogin = (
    loginFunction: (token: string) => Promise<any>,
    token: string,
  ) => {
    loginFunction(token)
      .then((response) => {
        setDataInLocalStorage(response?.data?.result);
        localStorage.setItem('host', APP_HOST.LISTENER);
        if (response?.data?.result?.userProfileCompleted) {
          navigate(`${LISTENER_APP_ROUTES.ROOT}`);
        } else {
          navigate(
            `${LISTENER_APP_ROUTES.ROOT}/${LISTENER_APP_ROUTES.CREATE_PROFILE}`,
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
      <Login
        handleLogin={handleLogin}
        path={`/${OPEN_APP_ROUTES.SIGN_UP}`}
        handleGoogleLogin={(token: string) => handleSocialLogin(googleLogin, token)}
        handleFacebookLogin={(token: string) => handleSocialLogin(facebookLogin, token)}
        handleLinkedInLogin={(token: string) => handleSocialLogin(linkedinLogin, token)}
      />
    </div>
  );
};

const mapDispatchToProps = {
  listenerLoginAction,
};

export default connect(null, mapDispatchToProps)(LoginPage);
