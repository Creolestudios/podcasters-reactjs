import React, { FC } from 'react';
import { useField } from 'formik';

interface IProps {
  label: string;
  className?: string;
  name: string;
  children: any;
}
const RadioButtonWrapper: FC<IProps> = (props) => {
  const {
    label, className, name, children,
  } = props;
  const [, meta] = useField({ name });

  return (
    <div className={`from-group-wrapper ${className}`}>
      {/* eslint-disable-next-line */}
      <label>{label}</label>
      {children}
      {meta?.touched && meta?.error && (
        <span className='text-danger position-absolute fs-6 fw-normal error'>{meta?.error}</span>
      )}
    </div>
  );
};
RadioButtonWrapper.defaultProps = {
  className: '',
};

export default RadioButtonWrapper;
