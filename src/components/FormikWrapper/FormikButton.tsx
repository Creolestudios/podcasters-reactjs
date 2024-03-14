import React, { FC } from 'react';
import { useField } from 'formik';
import ButtonWrapper, { IPops as IButtonProps } from '../form/ButtonWrapper';

interface IProps extends IButtonProps {
  name: string;
  value: string;
}

const FormikButton: FC<IProps> = ({
  children,
  type,
  name,
  value,
  className,
  isDisabled,
}) => {
  const [field, meta, helper] = useField({ name });

  const onClick = () => helper.setValue(value);

  return (
    <ButtonWrapper
      type={type}
      onClick={onClick}
      className={className}
      isDisabled={isDisabled}
    >
      {children}
    </ButtonWrapper>
  );
};

export default FormikButton;
