import React from 'react';
import FormikWrapper from '../FormikWrapper';
import FormikFieldWrapper from '../FormikWrapper/FormikFieldWrapper';
import PasswordInput from '../form/PasswordInput';
import SocialAuth from '../auth/SocialAuth';
import { signupSchema } from '../../utils/formValidationSchema';
import { ISignup } from '../../types/auth';

import Logo from '../../assets/svg/Logo';

interface IProps {
  handleRegister: CallableFunction;
  handleGoogleLogin: CallableFunction;
  handleFacebookLogin: CallableFunction;
  handleLinkedInLogin: CallableFunction;
  path: string;
}

const Register: React.FC<IProps> = ({
  handleRegister,
  path,
  handleGoogleLogin,
  handleFacebookLogin,
  handleLinkedInLogin,
}) => {
  const initialValues: ISignup = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  return (
    <div className='register-container'>
      <div className='d-flex min-vh-100'>
        <div className='login-style'>
          <div>
            <div className='register-logo'>
              <div className='d-flex justify-content-center'>
                <Logo />
              </div>
            </div>

            <div className='mb-35 text-center'>
              <h1 className='text-center'>Register</h1>
            </div>

            <div className='max-width-335 text-left'>
              <FormikWrapper
                initialValues={initialValues}
                validationSchema={signupSchema}
                button={{
                  className: 'btn-style w-100 mt-50',
                  children: 'Register',
                }}
                onSubmit={handleRegister}
              >
                <FormikFieldWrapper
                  label='Email Address'
                  name='email'
                  type='email'
                  placeholder='Enter email address'
                />
                <PasswordInput
                  label='Password'
                  name='password'
                  placeholder='Enter Password'
                />
                <PasswordInput
                  label='Confirm Password'
                  name='confirmPassword'
                  placeholder='Enter Password'
                />
              </FormikWrapper>

              <div className='or position-relative text-center'>
                <span>OR</span>
              </div>
              <SocialAuth
                path={path}
                handleGoogleLogin={handleGoogleLogin}
                handleFacebookLogin={handleFacebookLogin}
                handleLinkedInLogin={handleLinkedInLogin}
              />
            </div>
          </div>
        </div>
        <div className='w-50 login-bg d-none d-lg-block' />
      </div>
    </div>
  );
};

export default Register;
