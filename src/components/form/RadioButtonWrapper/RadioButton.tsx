import React, { FC, useRef } from 'react';
import { useField } from 'formik';

interface IProps {
  label: string;
  className?: string;
  id: string;
  name: string;
  value: string;
  checked?: boolean;
}
const RadioButton: FC<IProps> = (props) => {
  const {
    label, id, className, value, name, checked,
  } = props;
  const [, , { setValue }] = useField(props);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    inputRef?.current?.click();
  };

  return (
    // eslint-disable-next-line
    <div
      className={`radio-btn d-flex justify-content-start align-items-center ${className}`}
      onClick={handleDivClick}
    >
      <input
        ref={inputRef}
        id={id}
        type='radio'
        value={value}
        name={name}
        onChange={(e) => {
          setValue(e?.target?.value);
        }}
        defaultChecked={checked}
      />
      {/* eslint-disable-next-line */}
      <label htmlFor={id} className={`${className}`}>
        {label}
      </label>
    </div>
  );
};
RadioButton.defaultProps = {
  className: '',
  checked: false,
};

export default RadioButton;
