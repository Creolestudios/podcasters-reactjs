/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, ChangeEvent } from 'react';
import ResizeImage from '../ResizeImage/ResizeImage';
import { showToastMessage } from '../../utils';
import { TOASTER_STATUS } from '../../constant';

interface DragDropImageProps {
  handleFile: (file: File | Blob) => void;
  icon: React.ReactNode;
  height: number;
  width: number;
  src: string | null;
  setSrc: React.Dispatch<React.SetStateAction<string | null>>;
}

const DragDropImage: React.FC<DragDropImageProps> = ({
  handleFile,
  icon,
  height,
  width,
  src,
  setSrc,
}) => {
  const bannerUploadRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e?.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e?.preventDefault();
    if (e?.dataTransfer?.files[0]?.type?.split('/')[0] === 'image') {
      setSrc(URL.createObjectURL(e?.dataTransfer?.files[0]));
      handleFile(e?.dataTransfer?.files[0]);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, 'Please upload image file');
    }
  };

  const handleClick = () => {
    bannerUploadRef?.current?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile: File | undefined = event?.currentTarget?.files?.[0];
    if (selectedFile) {
      if (selectedFile?.type?.split('/')[0] === 'image') {
        setSrc(URL.createObjectURL(selectedFile));
        handleFile(selectedFile);
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, 'Please upload image file');
      }
    }
  };

  const handleResize = (value: any) => {
    handleFile(value);
    setSrc(null);
  };

  return (
    <>
      <div
        className='form-control d-flex align-items-center justify-content-center w-180 h-180'
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <span>{icon}</span>
        <input
          accept='image/*'
          hidden
          type='file'
          name='file'
          id='profile-pic'
          ref={bannerUploadRef}
          onChange={handleChange}
        />
      </div>
      {src && (
        <ResizeImage
          handleFile={handleResize}
          show={!!src}
          src={src}
          height={height || 0}
          width={width || 0}
          onHide={() => setSrc('')}
        />
      )}
    </>
  );
};

export default DragDropImage;
