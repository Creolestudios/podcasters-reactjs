import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FormikWrapper from '../../components/FormikWrapper';
import PasswordInput from '../../components/form/PasswordInput';
import { resetPasswordSchema } from '../../utils/formValidationSchema';
import { resetPasswordService, setPasswordForInvitedUser } from '../../services/user/User';
import FullPageLoader from '../../components/Loader/FullPageLoader';
import {
  ADMIN_APP_ROUTES,
  ADVERTISER_APP_ROUTES,
  OPEN_APP_ROUTES,
  PODCASTER_APP_ROUTES,
} from '../../constant/appRoute';

import Logo from '../../assets/svg/Logo';
import { IResetPassword } from '../../types/auth';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const query = new URLSearchParams(location.search);
  const role = query.get('role');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const initialValues: IResetPassword = {
    password: '',
    confirmPassword: '',
  };

  useEffect(() => {
    if (params?.token) {
      setToken(params.token);
    }
  }, []);

  const handleLoading = (value: boolean) => setIsLoading(value);
  const onSave = () => {
    if (role === 'PODCASTER') {
      navigate(`/${PODCASTER_APP_ROUTES.LOGIN}`);
    } else if (role === 'ADVERTISER') {
      navigate(`/${ADVERTISER_APP_ROUTES.LOGIN}`);
    } else if (role === 'ADMIN') {
      navigate(`/${ADMIN_APP_ROUTES.LOGIN}`);
    } else {
      navigate(`/${OPEN_APP_ROUTES.LOGIN}`);
    }
  };

  const handleResetPassword = (values: IResetPassword) => {
    handleLoading(true);
    if (location.pathname.startsWith('/invited-user')) {
      setPasswordForInvitedUser({ ...values, token }, onSave, handleLoading);
    } else {
      resetPasswordService({ ...values, token }, onSave, handleLoading);
    }
  };

  return (
    <div className='d-flex min-vh-100'>
      {isLoading && <FullPageLoader isScreenExist />}
      <div className='login-style'>
        <div>
          <div className='register-logo mt-110'>
            <div className='d-flex justify-content-center'>
              <Logo />
            </div>
          </div>

          <div className='mb-54 text-center'>
            <h1 className='mb-0'>Set New Password</h1>
          </div>

          <div className='max-width-335 text-left'>
            <FormikWrapper
              initialValues={initialValues}
              validationSchema={resetPasswordSchema}
              button={{
                className: 'btn-style w-100 mt-50',
                children: 'Save',
              }}
              onSubmit={handleResetPassword}
            >
              <PasswordInput label='Password' name='password' placeholder='Enter Password' />
              <PasswordInput
                label='Confirm Password'
                name='confirmPassword'
                placeholder='Enter Password'
              />
            </FormikWrapper>
          </div>
        </div>
      </div>
      <div className='w-50 login-bg reset-password d-none d-lg-block' />
    </div>
  );
};

export default ResetPassword;
