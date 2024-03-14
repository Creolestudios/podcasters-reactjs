import React, { FC, useState } from 'react';

import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormikFieldWrapper from '../../FormikWrapper/FormikFieldWrapper';
import { ILink } from '../../../types';
import { LINK_ARGS } from '../../../constant';

import './index.scss';

interface IProps {
  isForgotPasswordLink?: boolean;
  forgotPasswordArgs?: ILink;
  label: string;
  name: string;
  placeholder: string;
  className?: string;
}

const PasswordInput: FC<IProps> = ({
  isForgotPasswordLink,
  forgotPasswordArgs,
  label,
  name,
  placeholder,
  className,
}) => {
  const [isPasswordShow, setIsPasswordShow] = useState<boolean>(false);

  const handlePasswordShow = () => setIsPasswordShow(!isPasswordShow);

  return (
    <FormikFieldWrapper
      type={isPasswordShow ? 'text' : 'password'}
      label={label}
      name={name}
      placeholder={placeholder}
      className={`password-wrapper ${className}`}
      elementRender={
        isPasswordShow ? (
          <FontAwesomeIcon icon={faEyeSlash} onClick={handlePasswordShow} />
        ) : (
          <FontAwesomeIcon icon={faEye} onClick={handlePasswordShow} />
        )
      }
      hasLink={isForgotPasswordLink}
      linkArgs={forgotPasswordArgs}
    />
  );
};

PasswordInput.defaultProps = {
  isForgotPasswordLink: false,
  forgotPasswordArgs: LINK_ARGS,
  className: '',
};

export default PasswordInput;
