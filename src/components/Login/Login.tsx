import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import useCheckLoginStatus from '../../hooks/useCheckLoginStatus';
import FormikWrapper from '../FormikWrapper';
import FormikFieldWrapper from '../FormikWrapper/FormikFieldWrapper';
import PasswordInput from '../form/PasswordInput';
import { loginSchema } from '../../utils/formValidationSchema';
import Logo from '../../assets/svg/Logo';
import SocialAuth from '../auth/SocialAuth';
import APP_ROUTES, {
  ADMIN_APP_ROUTES,
  ADVERTISER_APP_ROUTES,
  LISTENER_APP_ROUTES,
  PODCASTER_APP_ROUTES,
} from '../../constant/appRoute';

interface LoginProps {
  path: any;
  handleLogin: any;
  handleEmailChange?: (value: string) => void;
  handleGoogleLogin?: (value: string) => void;
  handleFacebookLogin?: (value: string) => void;
  handleLinkedInLogin?: (value: string) => void;
}

const Login = ({
  path,
  handleLogin,
  handleEmailChange,
  handleFacebookLogin,
  handleGoogleLogin,
  handleLinkedInLogin,
}: LoginProps) => {
  useCheckLoginStatus();
  const location = useLocation();

  const initialValues: any = {
    email: '',
    password: '',
  };

  const forgotPasswordPath = () => {
    if (location?.pathname.split('/')[1] === 'podcaster') {
      return `/${PODCASTER_APP_ROUTES.FORGOT_PASSWORD}`;
    }
    if (location?.pathname.split('/')[1] === 'advertiser') {
      return `/${ADVERTISER_APP_ROUTES.FORGOT_PASSWORD}`;
    }
    if (location?.pathname.split('/')[1] === 'admin') {
      return `/${ADMIN_APP_ROUTES.FORGOT_PASSWORD}`;
    }
    return `/${LISTENER_APP_ROUTES.FORGOT_PASSWORD}`;
  };

  return (
    <div>
      <div className='d-flex min-vh-100'>
        <div className='login-style login-form-container'>
          <div>
            <div className='mt-110-2'>
              <div className='d-flex justify-content-center'>
                <Logo />
              </div>
            </div>

            <div className='mb-35 text-center'>
              <h1 className='mb-0'>Login</h1>
            </div>

            <div className='login-form'>
              <FormikWrapper
                initialValues={initialValues}
                validationSchema={loginSchema}
                button={{
                  className: 'btn-style w-100 mt-50',
                  children: 'Continue',
                }}
                onSubmit={handleLogin}
              >
                <FormikFieldWrapper
                  label='Email Address'
                  name='email'
                  type='email'
                  placeholder='Enter email address'
                  handleChange={(value: string) => {
                    if (handleEmailChange) {
                      handleEmailChange(value);
                    }
                  }}
                />
                <PasswordInput
                  isForgotPasswordLink
                  forgotPasswordArgs={{
                    path: forgotPasswordPath(),
                    children: 'Forgot Password?',
                  }}
                  label='Password'
                  name='password'
                  placeholder='Enter Password'
                />
              </FormikWrapper>
            </div>
            <div className='or position-relative text-center'>
              <span>OR</span>
            </div>
            {path &&
            handleGoogleLogin &&
            handleFacebookLogin &&
            handleLinkedInLogin ? (
              <SocialAuth
                path={path}
                handleGoogleLogin={handleGoogleLogin}
                handleFacebookLogin={handleFacebookLogin}
                handleLinkedInLogin={handleLinkedInLogin}
              />
            ) : (
              <Link
                to={APP_ROUTES.ROOT}
                className='link d-flex justify-content-center'
              >
                Go to home
              </Link>
            )}
          </div>
        </div>
        <div className='w-50 login-bg d-none d-lg-block' />
      </div>
    </div>
  );
};

Login.defaultProps = {
  handleEmailChange: () => {},
};

export default Login;
