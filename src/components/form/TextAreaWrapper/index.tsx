import React, { FC } from 'react';
import './index.scss';

interface IProps {
  label?: string;
  className?: string;
  name: string;
  rows?: number;
  cols?: number;
  value: string;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
}
const TextAreaWrapper: FC<IProps> = ({
  label,
  className,
  name,
  rows,
  cols,
  value,
  onChange,
  error,
  disabled,
  placeholder,
  maxLength,
  required,
}) => (
  <div className={`from-group-wrapper ${className}`}>
    {label !== '' && (
      <label htmlFor={name} className='form-label'>
        {label}
        {required && <span className='required red'>*</span>}
      </label>
    )}
    <textarea
      placeholder={placeholder}
      className={`form-control ${error ? 'border border-danger ' : ''}`}
      id={name}
      name={name}
      rows={rows}
      cols={cols}
      value={value}
      onChange={onChange}
      disabled={disabled}
      maxLength={maxLength}
    />
    {error && (
      <span className='text-danger position-absolute fs-6 fw-normal error m-l-10'>{error}</span>
    )}
  </div>
);
TextAreaWrapper.defaultProps = {
  rows: 3,
  cols: 50,
  className: '',
  label: '',
  disabled: false,
  placeholder: '',
  error: '',
  maxLength: 500,
  required: false,
};
export default TextAreaWrapper;
