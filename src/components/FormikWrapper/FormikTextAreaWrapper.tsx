import React, { FC } from 'react';
import { useField } from 'formik';
import TextAreaWrapper from '../form/TextAreaWrapper';

interface IProps {
  label?: string;
  className?: string;
  name: string;
  rows?: number;
  cols?: number;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

const FormikTextAreaWrapper: FC<IProps> = ({
  label,
  name,
  className,
  rows,
  cols,
  disabled,
  placeholder,
  required,
}) => {
  const [field, meta] = useField({ name });

  return (
    <TextAreaWrapper
      label={label}
      name={name}
      className={className}
      rows={rows}
      cols={cols}
      onChange={field?.onChange}
      value={field?.value}
      error={meta?.touched ? meta?.error ?? '' : ''}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
    />
  );
};

FormikTextAreaWrapper.defaultProps = {
  rows: 3,
  cols: 50,
  className: '',
  label: '',
  disabled: false,
  placeholder: '',
  required: false,
};

export default FormikTextAreaWrapper;
