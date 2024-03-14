import React, { FC, ReactNode } from 'react';
import IconButtonWrapper from '../IconButtonWrapper';

import LeftArrow from '../../assets/svg/LeftArrow';

interface IProps {
  onClick: () => void;
  text: string;
  isShow?: boolean;
  customElement?: ReactNode | null;
}

const BackButton: FC<IProps> = ({
  onClick, text, isShow, customElement,
}) => (
  <div className='d-md-flex d-block align-items-center justify-content-between main-div'>
    <div className='d-flex align-items-center justify-content-between w-100'>
      <div className='main-title d-flex align-items-center'>
        <IconButtonWrapper IconName={LeftArrow} onClick={() => onClick()} />
        <span className='m-l-10'>{text}</span>
      </div>

      {isShow && customElement && customElement}
    </div>
  </div>
);

BackButton.defaultProps = {
  isShow: false,
  customElement: null,
};

export default BackButton;
