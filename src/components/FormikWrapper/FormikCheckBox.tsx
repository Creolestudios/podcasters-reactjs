import React, { ChangeEvent, FC, ReactNode } from 'react';
import { useField } from 'formik';
import CheckBoxWrapper, {
  IProps as ICheckboxProps,
} from '../form/CheckBoxWrapper';

interface IProps extends Omit<ICheckboxProps, 'checked'> {
  customElement?: ReactNode | null;
}

const FormikCheckBox: FC<IProps> = ({
  name,
  label,
  customElement,
  disabled,
}) => {
  const [field, meta, helper] = useField({ name, type: 'checkbox' });
  const onChange = (evt: ChangeEvent<HTMLInputElement>) => helper.setValue(evt.target.checked);

  return (
    <CheckBoxWrapper
      name={name}
      id={name}
      label={label}
      checked={field.checked ?? false}
      onChange={onChange}
      customElement={customElement}
      disabled={disabled}
    />
  );
};

FormikCheckBox.defaultProps = {
  customElement: null,
};

export default FormikCheckBox;
