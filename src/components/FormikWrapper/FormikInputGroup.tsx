import React, {
  ChangeEvent, FC, ReactNode, useEffect,
} from 'react';
import { useField } from 'formik';
import InputGroupWrapper from '../form/InputGroupWrapper.tsx';

interface IProps {
  name: string;
  label: string;
  placeholder?: string;
  textValue: string;
  disabled?: boolean;
  customElement?: ReactNode | null;
  type: string;
  handleChange?: (value: string) => void;
  value?: string;
  hasValue?: boolean;
  required?: boolean;
}

const FormikInputGroup: FC<IProps> = ({
  name,
  label,
  placeholder,
  textValue,
  disabled,
  customElement,
  type,
  handleChange,
  value,
  hasValue,
  required,
}) => {
  const [field, meta, helper] = useField({ name, type });

  useEffect(() => {
    if (hasValue) {
      helper.setValue(value);
    }
  }, [value]);

  const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
    field.onChange(evt);
    if (handleChange) {
      handleChange(evt.target.value);
    }
  };

  return (
    <InputGroupWrapper
      name={name}
      label={label}
      value={hasValue ? value : field.value.toLowerCase()}
      onChange={onChange}
      error={meta.touched ? meta.error : ''}
      placeholder={placeholder}
      textValue={textValue}
      type={type}
      customElement={customElement}
      disabled={disabled}
      required={required}
    />
  );
};

FormikInputGroup.defaultProps = {
  placeholder: '',
  disabled: false,
  customElement: null,
  handleChange: () => {},
  value: '',
  hasValue: false,
  required: false,
};

export default FormikInputGroup;
