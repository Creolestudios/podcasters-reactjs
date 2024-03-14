import React from 'react';
import { Modal } from 'react-bootstrap';

import DeleteIconPop from '../../assets/svg/DeleteIconPop';
import Loader from '../Loader/Loader';
import { DeleteModalInterface } from '../../types/modelInterface';

const DeleteModal = (props: DeleteModalInterface) => {
  const {
    closeModal, handleDeleteData, loading, message,
  } = props;

  return (
    <Modal
      aria-labelledby='delete-popup'
      centered
      className='podcast-successfully delete-popup'
      // eslint-disable-next-line
      {...props}
    >
      <Modal.Body>
        <div className='box-width admin-delete'>
          <DeleteIconPop />

          <p className='admin-p-text'>{message || 'Do you really want to delete?'}</p>

          <div className='enhance-btn d-flex'>
            <button
              type='button'
              disabled={loading}
              className='btn btn-primary reject-btn w-50 me-2'
              onClick={() => closeModal(false)}
            >
              No
            </button>

            <button
              type='button'
              disabled={loading}
              className='btn-bg btn-primary btn-style w-50 ms-2 '
              onClick={handleDeleteData}
            >
              {loading ? <Loader /> : 'Yes'}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteModal;
