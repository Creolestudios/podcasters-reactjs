import { Option } from 'react-multi-select-component';
import React, { FC } from 'react';
import { useField } from 'formik';
import MultiSelectWrapper from '../form/MultiSelectWrapper';

interface IProps {
  label: string;
  className?: string;
  name: string;
  placeholder: string;
  disabled?: boolean;
  options: Option[];
  required?: boolean;
}

const FormikMultiSelectWrapper: FC<IProps> = ({
  label,
  name,
  className,
  options,
  disabled,
  placeholder,
  required,
}) => {
  const [field, meta, handleValue] = useField({ name });

  const handleChange = (value: { label: string; value: any }[]) => {
    handleValue.setValue(value?.map((data) => data.value));
  };

  const getValues = () => options.filter((option) => field?.value?.includes(option.value));

  return (
    <MultiSelectWrapper
      label={label}
      name={name}
      className={className}
      onChange={handleChange}
      value={getValues()}
      error={meta?.touched ? meta?.error ?? '' : ''}
      disabled={disabled}
      options={options}
      placeholder={placeholder}
      required={required}
    />
  );
};

FormikMultiSelectWrapper.defaultProps = {
  className: '',
  disabled: false,
  required: false,
};

export default FormikMultiSelectWrapper;
