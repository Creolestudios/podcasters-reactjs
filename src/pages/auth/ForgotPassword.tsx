import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import FormikWrapper from '../../components/FormikWrapper';
import FormikFieldWrapper from '../../components/FormikWrapper/FormikFieldWrapper';
import { forgotPasswordSchema } from '../../utils/formValidationSchema';
import {
  ADMIN_APP_ROUTES,
  ADVERTISER_APP_ROUTES,
  LISTENER_APP_ROUTES,
  PODCASTER_APP_ROUTES,
} from '../../constant/appRoute';
import { forgotPasswordService } from '../../services/user/User';

import Logo from '../../assets/svg/Logo';
import { IForgotPassword } from '../../types/auth';
import Loader from '../../components/Loader/Loader';
import { formatTime } from '../../utils';
import useCountdown from '../../hooks/useCountdown';

interface IProps {
  userRole: string;
}

const ForgotPassword: FC<IProps> = ({ userRole }) => {
  const initialValues: IForgotPassword = {
    email: '',
  };

  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleDisabled = (value: boolean) => setIsDisabled(value);

  const { countdown, resetCountdown } = useCountdown({
    initialCount: 0,
  });

  const handleStartCountdown = () => {
    resetCountdown(30); // Reset the countdown to 30 when the button is clicked
  };

  const backToLogin = () => {
    if (userRole === 'PODCASTER') {
      return `/${PODCASTER_APP_ROUTES.LOGIN}`;
    }
    if (userRole === 'ADVERTISER') {
      return `/${ADVERTISER_APP_ROUTES.LOGIN}`;
    }
    if (userRole === 'ADMIN') {
      return `/${ADMIN_APP_ROUTES.LOGIN}`;
    }
    return `/${LISTENER_APP_ROUTES.LOGIN}`;
  };

  return (
    <div className='d-flex min-vh-100'>
      <div className='login-style'>
        <div>
          <div className='mt-110'>
            <div className='d-flex justify-content-center'>
              <Logo />
            </div>
          </div>
          <div className='mb-54 text-center'>
            <h1 className='mb-0'>Forgot Password</h1>
          </div>
          <div className='max-width-335 text-left'>
            <FormikWrapper
              initialValues={initialValues}
              validationSchema={forgotPasswordSchema}
              button={{
                className: 'btn-style w-100 mt-50',
                children: isDisabled ? <Loader /> : 'Send',
                isDisabled: isDisabled || !!countdown,
              }}
              onSubmit={(values: any) => {
                handleDisabled(true);
                const data = { email: values?.email, role: userRole };
                forgotPasswordService(data, handleStartCountdown, handleDisabled);
              }}
            >
              <FormikFieldWrapper
                label='Email Address'
                name='email'
                type='email'
                placeholder='Enter email address'
              />
            </FormikWrapper>
            {countdown ? (
              <div className='mt-2 countdown'>
                <span>Resend Email in</span>
                <span className='sec'>{formatTime(countdown)}</span>
              </div>
            ) : null}
            <div className='forgot position-relative top-20 d-flex justify-content-center mt-1'>
              <Link className='cursor-pointer link mt-25' to={backToLogin()}>
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='w-50 login-bg reset-password d-none d-lg-block' />
    </div>
  );
};

export default ForgotPassword;
