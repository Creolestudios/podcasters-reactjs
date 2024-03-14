import React, {
  ChangeEvent, FC, ReactNode, useState,
} from 'react';
import { useField } from 'formik';
import FormGroupWrapper from '../form/FormGroupWrapper';

import { ILink } from '../../types';
import { LINK_ARGS } from '../../constant';

import './formik-field-wrapper.scss';

interface IProps {
  name: string;
  label: string;
  type: string;
  elementRender?: ReactNode | null;
  className?: string;
  hasLink?: boolean;
  linkArgs?: ILink;
  placeholder?: string;
  disabled?: boolean;
  min?: number | string | undefined;
  handleChange?: (value: string) => void;
  required?: boolean;
  validateOnChange?: any;
}

const FormikFieldWrapper: FC<IProps> = ({
  label,
  name,
  type,
  elementRender,
  className,
  hasLink,
  linkArgs,
  placeholder,
  disabled,
  min,
  handleChange,
  required,
  validateOnChange,
}) => {
  const [field, meta] = useField({ name, type });
  const [isValidateOnChange, setIsValidateOnChange] = useState<boolean>(false);

  const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
    field.onChange(evt);
    if (validateOnChange) {
      const types = Object.keys(validateOnChange);

      types.forEach((type: string) => {
        if (type === 'length' && validateOnChange.length) {
          setIsValidateOnChange(true);
        }
      });
    }

    if (handleChange) {
      handleChange(evt.target.value);
    }
  };

  return (
    <FormGroupWrapper
      label={label}
      name={field.name}
      type={type}
      value={field.value}
      onChange={onChange}
      className={className}
      elementRender={elementRender}
      error={meta.touched || isValidateOnChange ? meta.error : ''}
      hasLink={hasLink}
      linkArgs={linkArgs}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      required={required}
    />
  );
};

FormikFieldWrapper.defaultProps = {
  elementRender: null,
  className: '',
  hasLink: false,
  linkArgs: LINK_ARGS,
  placeholder: '',
  disabled: false,
  min: undefined,
  handleChange: () => {},
  required: false,
  validateOnChange: null,
};

export default FormikFieldWrapper;
