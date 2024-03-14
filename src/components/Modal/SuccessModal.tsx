import React from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import PopupTickMark from '../../assets/svg/PopupTickMark';
import { SuccessModalInterface } from '../../types/modelInterface';

const SuccessModal = (props: SuccessModalInterface) => {
  const { onHide, podcastId, slugUrl } = props;
  const navigate = useNavigate();

  const handleClickAction = (navigateUrl: string) => {
    onHide();
    navigate(navigateUrl);
  };

  const goToPodcastUrl = '/podcaster';
  const addMoreEpisodeUrl = `/episode/add/${podcastId.id}`;

  return (
    <div className=' modal-dialog-centered podcast-successfully modal-content'>
      <div className='modal-content'>
        <Modal
          // eslint-disable-next-line
          {...props}
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          backdrop='static'
          centered
          className='podcast-successfully'
        >
          <Modal.Header className='modal-header podcast-successfully' />
          <Modal.Body className='modal-body podcast-successfully'>
            <PopupTickMark />
            <p>Podcast is successfully uploaded</p>
            <div className='yes-no'>
              <p>Do you want to add more episodes?</p>

              <div className='enhance-btn d-flex'>
                <button
                  type='submit'
                  className='btn btn-primary reject-btn w-50 me-2'
                  onClick={() => handleClickAction(goToPodcastUrl)}
                >
                  No
                </button>
                <button
                  type='submit'
                  className='btn-bg btn-primary btn-style w-50 ms-2'
                  onClick={() => handleClickAction(addMoreEpisodeUrl)}
                >
                  Yes
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default SuccessModal;
