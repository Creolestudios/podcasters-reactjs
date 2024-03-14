import React, { useState, useRef, useEffect } from 'react';
import IconButtonWrapper from '../IconButtonWrapper';
import RemoveIcon from '../../assets/svg/RemoveIcon';
import ButtonWrapper from '../form/ButtonWrapper';

interface IProps {
  elementRender?: any;
  popupElement: any;
  iconType?: string;
  IconName?: any;
  isIcon?: boolean;
}

const PopupButtonWrapper: React.FC<IProps> = ({
  elementRender,
  popupElement,
  IconName,
  iconType,
  isIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const popupRef: any = useRef();
  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  // Close the popup if the user clicks outside of it
  const handleClickOutside = (event: any) => {
    if (!popupRef?.current?.contains(event?.target)) closePopup();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='position-relative'>
      {isIcon ? (
        <IconButtonWrapper IconName={IconName} iconType={iconType} onClick={openPopup} />
      ) : (
        <ButtonWrapper onClick={openPopup}>{elementRender}</ButtonWrapper>
      )}

      {isOpen && (
        <div className='popup-button-wrapper position-absolute' ref={popupRef}>
          <IconButtonWrapper className='close-button' IconName={RemoveIcon} onClick={closePopup} />
          <div>{popupElement}</div>
        </div>
      )}
    </div>
  );
};

PopupButtonWrapper.defaultProps = {
  isIcon: false,
  IconName: null,
  iconType: '',
  elementRender: null,
};

export default PopupButtonWrapper;
