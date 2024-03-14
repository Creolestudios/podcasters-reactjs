import React, { FC, ReactNode } from 'react';
import { useField } from 'formik';
import SelectWrapper from '../form/SelectWrapper';

interface IProps {
  label: string;
  className?: string;
  name: string;
  disabled?: boolean;
  options: any;
  selectsuggestion: string;
  required?: boolean;
}

const FormikSelectWrapper: FC<IProps> = ({
  label,
  name,
  className,
  options,
  selectsuggestion,
  disabled,
  required,
}) => {
  const [field, meta] = useField({ name });

  return (
    <SelectWrapper
      label={label}
      name={name}
      className={className}
      onChange={field?.onChange}
      value={field?.value}
      error={meta?.touched ? meta?.error ?? '' : ''}
      disabled={disabled}
      options={options}
      selectsuggestion={selectsuggestion}
      required={required}
    />
  );
};

FormikSelectWrapper.defaultProps = {
  className: '',
  disabled: false,
  required: false,
};

export default FormikSelectWrapper;
