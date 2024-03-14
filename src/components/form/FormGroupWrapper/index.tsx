import React, { FC, ReactNode } from 'react';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

import { ILink } from '../../../types';
import { LINK_ARGS } from '../../../constant';

import './index.scss';

interface IProps {
  className?: string;
  name: string;
  label?: string;
  type: string;
  placeholder?: string;
  error: string | undefined;
  autoComplete?: string | undefined;
  onChange: any;
  value: string;
  elementRender?: ReactNode | null;
  hasLink?: boolean;
  linkArgs?: ILink;
  hasLabel?: boolean;
  disabled?: boolean;
  min?: number | string | undefined;
  max?: number | string | undefined;
  required?: boolean;
  onKeyDown?: any;
}

const FormGroupWrapper: FC<IProps> = ({
  className,
  name,
  label,
  type,
  placeholder,
  error,
  onChange,
  value,
  elementRender,
  hasLink,
  linkArgs,
  hasLabel,
  disabled,
  min,
  max,
  required,
  onKeyDown,
  autoComplete,
}) => (
  <Form.Group
    className={`from-group-wrapper ${className} ${!value ? 'empty-value' : ''}`}
    controlId={name}
  >
    {hasLabel && (
      <Form.Label>
        {label}
        {required && <span className='required red'>*</span>}
      </Form.Label>
    )}
    <Form.Control
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={onChange}
      value={value}
      disabled={disabled}
      className={error ? 'border border-danger ' : ''}
      min={min}
      max={max}
      onKeyDown={onKeyDown}
      autoComplete={autoComplete}
    />
    {elementRender && elementRender}

    {error && <span className='text-danger position-absolute fs-6 fw-normal error'>{error}</span>}

    {hasLink && (
      <Link to={linkArgs?.path ?? ''} className='forgot-password-link'>
        {linkArgs?.children}
      </Link>
    )}
  </Form.Group>
);

FormGroupWrapper.defaultProps = {
  className: '',
  placeholder: '',
  elementRender: null,
  hasLink: false,
  linkArgs: LINK_ARGS,
  hasLabel: true,
  label: '',
  disabled: false,
  min: undefined,
  max: undefined,
  required: false,
  onKeyDown: () => {},
};

export default FormGroupWrapper;
