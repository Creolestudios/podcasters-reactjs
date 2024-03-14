import React from 'react';
import { Modal } from 'react-bootstrap';

import RecorderIcon from '../../assets/svg/RecorderIcon';
import { MicrophonePermissionModalInterface } from '../../types/modelInterface';

const MicrophonePermissionModal = (
  props: MicrophonePermissionModalInterface,
) => {
  const { onHide } = props;

  return (
    <div className=' modal-dialog-centered podcast-successfully modal-content'>
      <div className='modal-content'>
        <Modal
          // eslint-disable-next-line
          {...props}
          aria-labelledby='contained-modal-title-vcenter'
          centered
          className='podcast-successfully'
        >
          <Modal.Body className='modal-body podcast-successfully py-5'>
            <div className=' d-flex justify-content-center'>
              <RecorderIcon />
            </div>
            <p className='mw-100 text-wrap py-2'>
              Unable to access microphone.
            </p>
            <p className='text-wrap pt-2 fs-5 lh-base text-dark'>
              Please allow us to access your microphone from browser settings.
            </p>
            <div className=''>
              <div className='d-flex justify-content-center'>
                <button
                  type='submit'
                  className='btn-bg btn-primary btn-style w-50 ms-2'
                  onClick={() => {
                    onHide();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default MicrophonePermissionModal;
