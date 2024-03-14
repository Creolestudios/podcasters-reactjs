import React, { FC } from 'react';
import { MultiSelect, Option } from 'react-multi-select-component';
import SvgIcons from '../../../assets/svg/SvgIcons';
import './index.scss';

interface IProps {
  className?: string;
  options: Option[];
  label: string;
  name: string;
  value: Option[];
  onChange: (value: { label: string; value: any }[]) => void;
  error: string;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
}

const renderArrows = () => <SvgIcons iconType='select-arrow' />;

const MultiSelectWrapper: FC<IProps> = ({
  options,
  className,
  name,
  label,
  value,
  onChange,
  error,
  disabled,
  placeholder,
  required,
}) => (
  <div className='from-group-wrapper mb-0'>
    <label className='form-label' htmlFor={name}>
      {label}
      {required && <span className='required red'>*</span>}
    </label>
    <MultiSelect
      className={`form-control form-select ${
        error ? 'border-danger' : ''
      } ${className}`}
      options={options}
      value={value}
      onChange={onChange}
      labelledBy='Select'
      disabled={disabled}
      overrideStrings={{
        selectSomeItems: placeholder,
        // search: 'Search Tag(s)',
      }}
      ArrowRenderer={renderArrows}
    />
    {error && (
      <span className='text-danger position-absolute fs-6 fw-normal error'>
        {error}
      </span>
    )}
  </div>
);
MultiSelectWrapper.defaultProps = {
  className: '',
  disabled: false,
  required: false,
};

export default MultiSelectWrapper;
