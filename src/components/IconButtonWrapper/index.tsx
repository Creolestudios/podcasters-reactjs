import React, { FC } from 'react';
import ButtonWrapper from '../form/ButtonWrapper';
import IconWrapper from '../IconWrapper';

import './index.scss';

interface IProps {
  IconName: any;
  iconType?: string;
  onClick: () => void;
  isDisabled?: boolean;
  className?: string;
}

const IconButtonWrapper: FC<IProps> = ({
  IconName,
  iconType,
  onClick,
  isDisabled,
  className,
}) => (
  <ButtonWrapper
    onClick={onClick}
    isBaseCssRequired
    className={`icon-btn ${className}`}
    isDisabled={isDisabled}
  >
    <IconWrapper IconName={IconName} iconType={iconType} />
  </ButtonWrapper>
);

IconButtonWrapper.defaultProps = {
  iconType: '',
  isDisabled: false,
  className: '',
};

export default IconButtonWrapper;
