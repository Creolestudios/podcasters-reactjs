import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftArrow from '../../assets/svg/LeftArrow';
import { ChangePasswordInterface } from '../../types';
import FormikWrapper from '../FormikWrapper';
import { changePasswordSchema } from '../../utils/formValidationSchema';
import PasswordInput from '../form/PasswordInput';
import {
  ADMIN_APP_ROUTES,
  ADVERTISER_APP_ROUTES,
  LISTENER_APP_ROUTES,
  PODCASTER_APP_ROUTES,
} from '../../constant/appRoute';
import { changePasswordService } from '../../services/user/User';
import FullPageLoader from '../Loader/FullPageLoader';
import { clearLocalStorage } from '../../utils';
import { APP_HOST } from '../../constant';

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const host = localStorage.getItem('host');
  const handleLoading = (value: boolean) => setIsLoading(value);
  const onSave = () => {
    switch (host) {
      case APP_HOST.PODCASTER:
        clearLocalStorage();
        navigate(`/${PODCASTER_APP_ROUTES.LOGIN}`);
        break;
      case APP_HOST.ADMIN:
        clearLocalStorage();
        navigate(`/${ADMIN_APP_ROUTES.LOGIN}`);
        break;
      default:
        clearLocalStorage();
        navigate(`/${LISTENER_APP_ROUTES.LOGIN}`);
    }
  };
  const handleChangePassword = (values: ChangePasswordInterface) => {
    const data = { oldPassword: values?.oldPassword, newPassword: values?.newPassword };
    handleLoading(true);
    changePasswordService(data, onSave, handleLoading);
  };

  return (
    <div className='d-flex min-vh-100'>
      {isLoading && <FullPageLoader isScreenExist />}
      <div className='login-style change-pass'>
        <div>
          <div className='d-md-flex d-block align-items-center justify-content-between mb-40 mt-5 '>
            <div className='main-title d-flex align-items-center '>
              {/* eslint-disable-next-line */}
              <span
                className='me-4 m-left me-lg-5 d-flex forward-btn'
                onClick={() => {
                  navigate(-1);
                }}
              >
                <LeftArrow />
              </span>
            </div>
          </div>

          <div className='mb-54 text-center'>
            <h1 className='mb-0'>Change Password</h1>
          </div>

          <div className='max-width-335 text-left'>
            <FormikWrapper
              initialValues={{
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
              }}
              validationSchema={changePasswordSchema}
              button={{
                className: 'btn-style w-100 mt-50',
                children: 'Save',
              }}
              onSubmit={handleChangePassword}
            >
              <PasswordInput label='Old Password' name='oldPassword' placeholder='Enter Password' />
              <PasswordInput label='New Password' name='newPassword' placeholder='Enter Password' />
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

export default ChangePassword;
