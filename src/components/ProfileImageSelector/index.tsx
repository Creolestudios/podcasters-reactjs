import React, { useState } from 'react';
import { useField } from 'formik';
import EditEpisode from '../../assets/svg/EditEpisode';
import DragDropImage from '../DragAndDrop/DragDropImage';
import CameraIcon from '../../assets/svg/CameraIcon';
import { getImageFileResolution, showToastMessage } from '../../utils';
import ResizeImage from '../ResizeImage/ResizeImage';
import { TOASTER_STATUS } from '../../constant';

interface IProps {
  name: string;
  changeFile: any;
  file: React.ChangeEvent<HTMLInputElement> | File | null;
  handleChangeImage: any;
  handleImageFile: any;
  width: number;
  height: number;
}

const ProfileImageSelector: React.FC<IProps> = ({
  name,
  changeFile,
  file,
  handleChangeImage,
  handleImageFile,
  width,
  height,
}) => {
  const [field, meta, { setValue }] = useField({ name });
  const [src, setSrc] = useState<string | null>(null);

  const onChange = (evt: File | Blob) => {
    if (evt?.type?.split('/')[0] === 'image') {
      getImageFileResolution(evt, (resolution: string) => {
        if (resolution === `${width}x${height}`) {
          setValue(evt);
          handleImageFile(evt);
        }
      });
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, 'Please upload audio file');
    }
  };

  const handleResize = (value: any) => {
    onChange(value);
    setSrc(null);
  };

  return (
    <div className='profile-pic-container'>
      {/* eslint-disable-next-line */}
      <label htmlFor='profile-pic'>Profile Picture</label>
      {field.value ? (
        <>
          <div className='banner-img rounded-3  position-relative h-100'>
            {/* eslint-disable-next-line */}
            <span
              className='close-banner'
              onClick={() => {
                if (changeFile && changeFile.current) {
                  changeFile.current.click();
                }
              }}
            >
              <EditEpisode />
            </span>
            <img
              src={file !== null ? URL.createObjectURL(file as File) : field.value || ''}
              alt='profile_picture'
              className='img-fluid profile-img rounded  on-hover'
            />

            <div className='d-flex justify-content-center'>
              <input
                type='file'
                accept='image/png, image/jpeg'
                onChange={(e) => {
                  const selectedFile: File | undefined = e?.target?.files?.[0];
                  if (selectedFile) {
                    if (selectedFile?.type?.split('/')[0] === 'image') {
                      onChange(selectedFile);
                      setSrc(URL.createObjectURL(selectedFile));
                    } else {
                      showToastMessage(TOASTER_STATUS.ERROR, 'Please upload image file');
                    }
                  }
                }}
                hidden
                ref={changeFile}
              />
            </div>
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
      ) : (
        <>
          <DragDropImage
            handleFile={onChange}
            icon={<CameraIcon />}
            height={250}
            width={250}
            src={src}
            setSrc={setSrc}
          />
          {meta?.touched && meta?.error && (
            <span className='text-danger position-absolute fs-6 fw-normal error'>
              {meta?.error}
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileImageSelector;
