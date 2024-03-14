import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from '../../../components/Login/Login';
import { advertiserLoginAction } from '../../../redux/actions/user';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import { APP_HOST, SUCCESS_MESSAGE, TOASTER_STATUS } from '../../../constant';
import { ILogin } from '../../../types/auth';
import { ADVERTISER_APP_ROUTES } from '../../../constant/appRoute';
import {
  facebookLogin,
  googleLogin,
  linkedinLogin,
  resendEmail,
  verifyAdvertiserService,
} from '../../../services/Advertiser/Auth';
import { setDataInLocalStorage, showToastMessage } from '../../../utils';
import ButtonWrapper from '../../../components/form/ButtonWrapper';

interface LoginPageProps {
  advertiserLoginAction: CallableFunction;
}

const LoginPage = ({ advertiserLoginAction }: LoginPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getVerifyRoute = () => {
    const path = ADVERTISER_APP_ROUTES.VERIFY.split(':')[0];
    const _path = path.slice(0, path.length - 1);

    return `/${_path}/${token}`;
  };

  const redirect = (path: string) => navigate(path);

  useEffect(() => {
    const pathName = location.pathname;

    if (token && pathName === getVerifyRoute()) {
      verifyAdvertiserService(token, SUCCESS_MESSAGE.USER_ACTIVATION, redirect);
    }
  }, []);

  const onContinue = (userProfile: boolean) => {
    if (userProfile) {
      redirect(ADVERTISER_APP_ROUTES.ROOT);
    } else {
      redirect(`${ADVERTISER_APP_ROUTES.ROOT}`);
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

  const handleLoading = (value: boolean) => setIsLoading(value);

  const handleLogin = (values: ILogin) => {
    handleLoading(true);
    advertiserLoginAction(values, handleLoading, onContinue, handleResendEmail);
  };

  const handleSocialLogin = (
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
      <Login
        handleLogin={handleLogin}
        path={`/${ADVERTISER_APP_ROUTES.SIGN_UP}`}
        handleGoogleLogin={(token: string) => handleSocialLogin(googleLogin, token)}
        handleFacebookLogin={(token: string) => handleSocialLogin(facebookLogin, token)}
        handleLinkedInLogin={(token: string) => handleSocialLogin(linkedinLogin, token)}
      />
    </div>
  );
};

const mapDispatchToProps = {
  advertiserLoginAction,
};

export default connect(null, mapDispatchToProps)(LoginPage);
