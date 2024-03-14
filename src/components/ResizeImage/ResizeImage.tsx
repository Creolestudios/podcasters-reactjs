import React, { useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import {
  centerCrop, Crop, makeAspectCrop, ReactCrop,
} from 'react-image-crop';

import Loader from '../Loader/Loader';
import { resizeImageInterface } from '../../types/dragDropInterface';

const ResizeImage = (props: resizeImageInterface) => {
  const {
    src, handleFile, height, width,
  } = props || {};
  const [showModal, setShowModal] = useState(false);
  const [crop, setCrop] = useState<Crop | null>(null);
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const centerAspectCrop = (mediaWidth: number, mediaHeight: number) => centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width,
      },
      width / height,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );

  const cropImage = () => {
    if (imageRef.current && completedCrop?.width && completedCrop?.height) {
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      const targetWidth = width;
      const targetHeight = height;
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          imageRef.current,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          targetWidth,
          targetHeight,
        );
      }

      canvas.toBlob((blob) => {
        handleFile(blob);
      }, 'image/jpeg');
    }
  };

  const onImageLoaded = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { width, height } = e.currentTarget;
    setShowModal(true);
    setCrop(centerAspectCrop(width, height));
  };

  return (
    <div className='modal-dialog modal-dialog-centered podcast-successfully delete-popup'>
      <div className='modal-content'>
        <Modal
          // eslint-disable-next-line
          {...props}
          aria-labelledby='contained-modal-title-vcenter'
          centered
          backdrop='static'
          className='podcast-successfully'
        >
          <Modal.Header
            closeButton
            className='modal-invite crop-image-modal-header mt-0'
          >
            <div className='d-flex align-items-center h-100 fs-3 my-4'>
              Crop Image
            </div>
          </Modal.Header>
          <Modal.Body>
            {!showModal && (
              <div className='text-center'>
                <Loader />
              </div>
            )}
            <div className='text-center'>
              <ReactCrop
                crop={crop as Crop}
                onComplete={(c) => setCompletedCrop(c)}
                onChange={(c) => setCrop(c)}
                aspect={width / height}
                keepSelection
                locked
              >
                <img
                  hidden={!showModal}
                  src={src}
                  className='text-center'
                  ref={imageRef}
                  // onLoadedData={() => {}} // not allowed here, hence commenting
                  onLoad={onImageLoaded}
                  alt='modal'
                />
              </ReactCrop>
              {showModal && (
                <div className='d-flex justify-content-center'>
                  <button
                    type='button'
                    className='btn-primary btn-bg btn-style h-42px'
                    onClick={cropImage}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default ResizeImage;
