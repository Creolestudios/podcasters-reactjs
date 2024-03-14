import React, { FC, ReactNode } from 'react';
import { Button } from 'react-bootstrap';

export interface IPops {
  type?: 'button' | 'submit' | 'reset';
  children: any;
  className?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  Icon?: any | null;
  isBaseCssRequired?: boolean;
  IconElement?: any;
}

const ButtonWrapper: FC<IPops> = ({
  type,
  children,
  className,
  onClick,
  isDisabled,
  Icon,
  isBaseCssRequired,
  IconElement,
}) => (
  <Button
    type={type}
    className={
      isBaseCssRequired ? className : `btn-primary btn-style ${className}`
    }
    onClick={onClick}
    disabled={isDisabled}
  >
    {Icon && <Icon />}
    {IconElement && IconElement}
    {children}
  </Button>
);

ButtonWrapper.defaultProps = {
  type: 'button',
  className: '',
  onClick: () => {},
  isDisabled: false,
  Icon: null,
  isBaseCssRequired: false,
  IconElement: null,
};

export default ButtonWrapper;
