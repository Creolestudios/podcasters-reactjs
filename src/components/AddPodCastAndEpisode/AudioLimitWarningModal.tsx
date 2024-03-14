import React from 'react';
import ModalWrapper from '../form/ModalWrapper';
import SvgIcons from '../../assets/svg/SvgIcons';

interface AudioLimitWarningModalProps {
  open: boolean;
  close: () => void;
  message: string;
  buttonText: string;
  onContinue: () => void;
}

const AudioLimitWarningModal = ({
  open,
  close,
  message,
  buttonText,
  onContinue,
}: AudioLimitWarningModalProps) => (
  <ModalWrapper
    size='sm'
    show={open}
    handleClose={close}
    body={{
      title: message,
      content: '',
      icon: {
        Element: SvgIcons,
        type: 'alert-icon',
      },
    }}
    button1={{
      children: buttonText,
      onClick: onContinue,
    }}
    button2={{
      children: '',
      onClick: () => {},
    }}
    isButton
    isShowCloseButton={false}
    className='warning-modal'
  />
);

export default AudioLimitWarningModal;
