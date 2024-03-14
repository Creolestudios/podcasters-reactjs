import React, { ReactNode } from 'react';

export interface IProps {
  name: string;
  id?: string;
  className?: string;
  label: string;
  disabled?: boolean;
  checked: boolean;
  onChange?: (e: any) => void;
  customElement?: ReactNode | null;
}
// eslint-disable-next-line
const CheckBoxWrapper: React.FC<IProps> = ({
  name,
  id,
  className,
  label,
  disabled,
  checked,
  onChange,
  customElement,
}) => (
  <div className='position-relative mb-2'>
    <input
      type='checkbox'
      disabled={disabled}
      id={id}
      name={name}
      checked={checked}
      onChange={onChange}
      className={className}
    />
    {/* eslint-disable-next-line */}
    <label htmlFor={id} className='checkbox'>
      {label}
    </label>
    {customElement && customElement}
  </div>
);

CheckBoxWrapper.defaultProps = {
  disabled: false,
  className: '',
  id: '',
  onChange: () => {},
  customElement: null,
};

export default CheckBoxWrapper;
