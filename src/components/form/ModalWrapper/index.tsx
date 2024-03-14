import React, { FC, ReactNode, memo } from 'react';
import { Modal } from 'react-bootstrap';

import ButtonWrapper from '../ButtonWrapper';
import IconButtonWrapper from '../../IconButtonWrapper';
import CloseIcon from '../../../assets/svg/CloseIcon';

import './index.scss';

interface IIcon {
  Element: any;
  type?: string;
}

interface IModalBody {
  icon?: IIcon;
  title: string;
  content: any;
}

interface IButton {
  children: any;
  onClick?: () => void;
  isDisabled?: boolean;
  className?: string;
}

type Size = 'sm' | 'lg' | 'xl' | undefined;

interface IProps {
  size: Size;
  show: boolean;
  body: IModalBody;
  button1: IButton;
  button2?: IButton;
  handleClose: () => void;
  customElement?: ReactNode | null;
  isButton?: boolean;
  bodyClass?: string;
  className?: string;
  isShowCloseButton?: boolean;
}

const ModalWrapper: FC<IProps> = ({
  size,
  show,
  body,
  button1,
  button2,
  handleClose,
  customElement,
  isButton,
  bodyClass,
  className,
  isShowCloseButton,
}) => {
  const { icon, title, content } = body;
  const {
    children: children1,
    onClick: button1Click,
    isDisabled,
    className: button1ClassName,
  } = button1;

  return (
    <Modal
      size={size}
      aria-labelledby='contained-modal-title-vcenter'
      backdrop='static'
      centered
      show={show}
      className={`podcast-successfully payment-successful modal-wrapper ${className}`}
    >
      {isShowCloseButton && (
        <IconButtonWrapper IconName={CloseIcon} onClick={handleClose} className='modal-close-btn' />
      )}
      <Modal.Body className={bodyClass}>
        {icon && <icon.Element iconType={icon.type !== '' ? icon.type : ''} />}
        {title && <p>{title}</p>}
        {content && <p className='p-0 payment-desc'>{content}</p>}
        {customElement && customElement}

        {isButton && (
          <div className={`enhance-btn d-flex ${button2?.children ? 'max-unset' : ''}`}>
            {children1 && (
              <ButtonWrapper
                onClick={button1Click}
                className={`btn-bg ${
                  button2?.children ? 'reject-btn w-50 me-md-2 me-sm-0' : 'w-100'
                } ${button1ClassName}`}
                isDisabled={isDisabled}
              >
                {children1}
              </ButtonWrapper>
            )}

            {button2?.children && (
              <ButtonWrapper
                onClick={button2.onClick}
                className={`btn-bg w-50 ms-md-2 ms-sm-0 ${button2.className}`}
                isDisabled={button2?.isDisabled}
              >
                {button2.children}
              </ButtonWrapper>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

ModalWrapper.defaultProps = {
  button2: {
    children: undefined,
    onClick: () => {},
  },
  customElement: null,
  isButton: true,
  bodyClass: '',
  className: '',
  isShowCloseButton: true,
};

export default memo(
  ModalWrapper,
  (prevProps, nextProps) => prevProps.show === false && nextProps.show === false,
);
