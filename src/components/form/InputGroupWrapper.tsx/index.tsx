import React, { FC, ReactNode } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import './index.scss';

interface IProps {
  name: string;
  placeholder?: string;
  textValue: string;
  value: string;
  onChange: any;
  disabled?: boolean;
  error?: string | undefined;
  label: string;
  customElement?: ReactNode | null;
  type: string;
  required?: boolean;
}

const InputGroupWrapper: FC<IProps> = ({
  name,
  placeholder,
  textValue,
  value,
  onChange,
  disabled,
  error,
  label,
  customElement,
  type,
  required,
}) => (
  <Form.Group className='from-group-wrapper input-group-container'>
    <Form.Label>
      {label}
      {required && <span className='required red'>*</span>}
    </Form.Label>
    <InputGroup>
      <InputGroup.Text id={name} className='form-control text'>
        {textValue}
      </InputGroup.Text>
      <Form.Control
        placeholder={placeholder}
        aria-label={placeholder}
        aria-describedby={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={error ? 'border border-danger ' : ''}
        name={name}
      />
      {customElement && customElement}
    </InputGroup>
    {error && <span className='text-danger position-absolute fs-6 fw-normal error'>{error}</span>}
  </Form.Group>
);

InputGroupWrapper.defaultProps = {
  placeholder: '',
  disabled: false,
  error: undefined,
  customElement: null,
  required: false,
};

export default InputGroupWrapper;
