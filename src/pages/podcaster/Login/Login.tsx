import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import Login from '../../../components/Login/Login';
import {
  checkEmail,
  sendEmail,
  verifyUserPodcasterService,
  verifyPodcasterService,
  googleLogin,
  facebookLogin,
  linkedinLogin,
  resendEmail,
} from '../../../services/podcaster/Auth';
import {
  facebookLogin as listenerFacebookLogin,
  googleLogin as listenerGoogleLogin,
  linkedinLogin as listnerLinkedinLogin,
} from '../../../services/listener/Auth';
import { podCasterLoginAction } from '../../../redux/actions/user';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import { APP_HOST, SUCCESS_MESSAGE, TOASTER_STATUS } from '../../../constant';
import APP_ROUTES, { OPEN_APP_ROUTES, PODCASTER_APP_ROUTES } from '../../../constant/appRoute';
import { ILogin } from '../../../types/auth';
import { useDebounce } from '../../../hooks/useDebounce';
import { setDataInLocalStorage, showToastMessage } from '../../../utils';
import ButtonWrapper from '../../../components/form/ButtonWrapper';
import ModalWrapper from '../../../components/form/ModalWrapper';

interface IProps {
  podCasterLoginAction: (
    loginData: ILogin,
    handleLoading: (value: boolean) => void,
    onContinue: (userProfile: boolean, userPurchasedPlan: boolean) => void,
    handleResendEmail: (email: string) => void
  ) => void;
}

const LoginPage: React.FC<IProps> = ({ podCasterLoginAction }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useParams();
  const [email, setEmail] = useState('');
  const [podcasterPopup, setPodcasterPopup] = useState<any>({
    showPopup: false,
    accessToken: '',
    login: null,
    email: '',
    loginWith: '',
  });

  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const debounced = useDebounce(email, 1000);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDisabled = (value: boolean) => setIsDisabled(value);

  const onClosePodcasterPopup = () => setPodcasterPopup({
    showPopup: false,
    accessToken: '',
    login: null,
  });

  const getVerifyRoute = () => {
    const path = PODCASTER_APP_ROUTES.VERIFY.split(':')[0];
    const _path = path.slice(0, path.length - 1);

    return `/${_path}/${token}`;
  };

  const getListenerVerifyRoute = () => {
    const path = PODCASTER_APP_ROUTES.ACTIVATION.split(':')[0];
    const activationPath = path.slice(0, path.length - 1);

    return `/${activationPath}/${token}`;
  };

  const redirect = (path: string) => navigate(path);

  useEffect(() => {
    const pathName = location.pathname;

    if (token && pathName === getVerifyRoute()) {
      verifyPodcasterService(token, SUCCESS_MESSAGE.USER_ACTIVATION, redirect);
    }
    if (token && pathName === getListenerVerifyRoute()) {
      verifyUserPodcasterService(token, SUCCESS_MESSAGE.USER_ACTIVATION, redirect);
    }
  }, []);

  const onContinue = (userProfile: boolean, userPurchasedPlan: boolean) => {
    if (userProfile) {
      if (userPurchasedPlan) {
        redirect(PODCASTER_APP_ROUTES.ROOT);
      } else {
        redirect(`${PODCASTER_APP_ROUTES.ROOT}/${APP_ROUTES.SUBSCRIPTION}`);
      }
    } else {
      redirect(`${PODCASTER_APP_ROUTES.ROOT}/${PODCASTER_APP_ROUTES.CREATE_PROFILE}`);
    }
  };

  const handleResendEmail = (email: string) => showToastMessage(
    TOASTER_STATUS.ERROR,
    <div className='send-email-podcaster'>
      <div className='m-r-10'>
        Your account is not activated. please check your email for invitation mail.
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
    podCasterLoginAction(values, handleLoading, onContinue, handleResendEmail);
  };

  const handleEmailChange = async (value: string) => {
    setEmail(value);
  };

  const doCheckEmail = async () => {
    const response = await checkEmail(encodeURIComponent(email));
    if (response && response?.data?.success && response?.data?.result) {
      setPodcasterPopup({
        showPopup: true,
        accessToken: token,
        login: handleLogin,
        email,
      });
    }
  };

  useEffect(() => {
    if (debounced) {
      doCheckEmail();
    }
  }, [debounced]);

  const handleSocialLogin = (
    loginFunction: (token: string) => Promise<any>,
    token: string,
    loginWith: string,
  ) => {
    loginFunction(token)
      .then((response) => {
        setDataInLocalStorage(response?.data?.result);
        localStorage.setItem('host', APP_HOST.PODCASTER);
        if (response?.data?.result?.userProfileCompleted) {
          navigate(`${PODCASTER_APP_ROUTES.ROOT}/${APP_ROUTES.SUBSCRIPTION}`, {
            state: { isRedirectFromLogin: true },
          });
        } else {
          navigate(`${PODCASTER_APP_ROUTES.ROOT}/${PODCASTER_APP_ROUTES.CREATE_PROFILE}`);
        }
      })
      .catch((error) => {
        if (error?.response?.data?.result?.errorCode === '4060010') {
          setPodcasterPopup({
            showPopup: true,
            accessToken: token,
            login: loginFunction,
            email: error?.response?.data?.result?.defaultMessageParamMap?.email,
            loginWith,
          });
        } else {
          showToastMessage(
            TOASTER_STATUS.ERROR,
            error?.response?.data?.result?.errorMessage || error?.message || 'Something went wrong!',
          );
        }
      });
  };

  const handleListenerSocialLogin = (
    loginFunction: (token: string) => Promise<any>,
    token: string,
  ) => {
    loginFunction(token)
      .then((response) => {
        setDataInLocalStorage(response?.data?.result);
        localStorage.setItem('host', APP_HOST.LISTENER);
        handleDisabled(false);
        if (response?.data?.result?.userProfileCompleted) {
          navigate(`${OPEN_APP_ROUTES.ROOT}`);
        } else {
          navigate(`/${OPEN_APP_ROUTES.CREATE_PROFILE}`);
        }
      })
      .catch((error) => {
        handleDisabled(false);
        showToastMessage(TOASTER_STATUS.ERROR, error?.message || 'Something went wrong!');
      });
  };

  return (
    <div>
      {isLoading && <FullPageLoader isScreenExist />}
      <Login
        handleLogin={handleLogin}
        path={`/${PODCASTER_APP_ROUTES.SIGN_UP}`}
        handleEmailChange={handleEmailChange}
        handleGoogleLogin={(token: string) => handleSocialLogin(googleLogin, token, 'google')}
        handleFacebookLogin={(token: string) => handleSocialLogin(facebookLogin, token, 'facebook')}
        handleLinkedInLogin={(token: string) => handleSocialLogin(linkedinLogin, token, 'linkedin')}
      />

      {podcasterPopup?.showPopup && (
        <ModalWrapper
          size='sm'
          show={podcasterPopup?.showPopup}
          body={{
            title: 'Do you want to join as podcaster?',
            content: (
              <>
                You are as a listener with this email
                {' '}
                <span className='email'>{podcasterPopup?.email}</span>
              </>
            ),
          }}
          button1={{
            children: 'Continue As Listener',
            onClick: () => {
              if (podcasterPopup?.loginWith === 'google') {
                handleDisabled(true);
                handleListenerSocialLogin(listenerGoogleLogin, podcasterPopup?.accessToken);
              } else if (podcasterPopup?.loginWith === 'facebook') {
                handleDisabled(true);
                handleListenerSocialLogin(listenerFacebookLogin, podcasterPopup?.accessToken);
              } else if (podcasterPopup?.loginWith === 'linkedin') {
                handleDisabled(true);
                handleListenerSocialLogin(listnerLinkedinLogin, podcasterPopup?.accessToken);
              } else {
                navigate(`${OPEN_APP_ROUTES.ROOT}`);
              }
            },
            isDisabled,
          }}
          button2={{
            children: 'Join As Podcaster',
            onClick: () => {
              handleDisabled(true);
              sendEmail(encodeURIComponent(podcasterPopup?.email), handleDisabled, onContinue);
            },
            isDisabled,
          }}
          handleClose={onClosePodcasterPopup}
          className='join-podcaster-modal'
        />
      )}
    </div>
  );
};

const mapDispatchToProps = {
  podCasterLoginAction,
};

export default connect(null, mapDispatchToProps)(LoginPage);
