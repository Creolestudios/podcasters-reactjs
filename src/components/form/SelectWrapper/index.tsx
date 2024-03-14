import React, { FC } from 'react';
import Form from 'react-bootstrap/Form';

interface IProps {
  className?: string;
  options: any;
  label: string;
  name: string;
  selectsuggestion: string;
  value: string;
  onChange: (value: any) => void;
  error: string;
  disabled?: boolean;
  optionValue?: any;
  optionName?: any;
  required?: boolean;
}
const SelectWrapper: FC<IProps> = ({
  options,
  className,
  name,
  label,
  selectsuggestion,
  value,
  onChange,
  error,
  disabled,
  optionValue,
  optionName,
  required,
}) => (
  <div className='from-group-wrapper mb-0'>
    <label className='form-label' htmlFor={name}>
      {label}
      {required && <span className='required red'>*</span>}
    </label>
    <Form.Select
      name={name}
      aria-label='Default select example'
      className={`form-control form-select ${error ? 'border-danger' : ''} ${
        value === selectsuggestion ? 'select-suggestion' : ''
      }${className}`}
      value={value}
      onChange={onChange}
      disabled={disabled}
      id={name}
    >
      <option>{selectsuggestion}</option>
      {options.map((option: any) => (
        <option
          value={option[optionValue] || option?.value || option?.name || option}
          key={option[optionValue] || option?.value || option?.name || option}
        >
          {option[optionName] || option?.name || option}
        </option>
      ))}
    </Form.Select>
    {error && <span className='text-danger position-absolute fs-6 fw-normal error'>{error}</span>}
  </div>
);
SelectWrapper.defaultProps = {
  className: '',
  disabled: false,
  optionValue: '',
  optionName: '',
  required: false,
};

export default SelectWrapper;
