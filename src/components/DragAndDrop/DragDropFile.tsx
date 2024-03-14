import React, { useRef, useState } from 'react';

import ResizeImage from '../ResizeImage/ResizeImage';
import { DragDropFileInterface } from '../../types/dragDropInterface';
import {
  convertBytesIntoKB,
  convertBytesIntoMB,
  getMinutesFromSeconds,
  showToastMessage,
} from '../../utils';
import { TOASTER_STATUS } from '../../constant';
import {
  validateAudio,
  validateAudioWithDuration,
} from '../../utils/formValidationSchema';

const DragDropFile = ({
  handleFile,
  icon,
  name,
  accept,
  height,
  width,
  maxFileSize,
  sizeIn,
  disabled,
  content,
  subContent,
  isAudio,
  maxDuration,
  handleDragDropStyle,
}: DragDropFileInterface) => {
  const bannerUploadRef = useRef<HTMLInputElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);

  function checkSize(fileSize: number, maxFileSize: number) {
    if (sizeIn === 'KB') {
      return convertBytesIntoKB(fileSize) <= maxFileSize;
    }
    return convertBytesIntoMB(fileSize) <= maxFileSize;
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent) => {
    if (!disabled) {
      e.preventDefault();

      if (isAudio) {
        const uploadedFile = e.dataTransfer.files[0];
        if (uploadedFile?.type?.split('/')[0] === 'audio') {
          if (uploadedFile && uploadedFile?.size < 1024) {
            showToastMessage(
              TOASTER_STATUS.ERROR,
              'File size should be more than 1KB',
            );
          } else if (maxDuration && maxDuration > 0) {
            validateAudioWithDuration(
              uploadedFile,
              maxFileSize,
              maxDuration,
            ).then((response) => {
              if (typeof response === 'string') {
                showToastMessage(TOASTER_STATUS.ERROR, response);
              } else {
                handleFile(uploadedFile);
              }
            });
          } else {
            const result = validateAudio(uploadedFile, maxFileSize);

            if (typeof result === 'string') {
              showToastMessage(TOASTER_STATUS.ERROR, result);
            } else {
              handleFile(uploadedFile);
            }
          }
        } else {
          showToastMessage(TOASTER_STATUS.ERROR, 'Please upload audio file');
        }
      } else {
        const uploadedFile = e.dataTransfer.files[0];
        if (uploadedFile?.type?.split('/')[0] === 'image') {
          if (
            uploadedFile
            && !disabled
            && checkSize(uploadedFile.size, maxFileSize)
          ) {
            setSrc(URL.createObjectURL(uploadedFile));
            handleFile(uploadedFile);
          } else {
            showToastMessage(
              TOASTER_STATUS.ERROR,
              maxFileSize
                ? `File size should not be more than ${maxFileSize}${
                  sizeIn ?? ''
                }`
                : 'File size too large',
            );
          }
        } else {
          showToastMessage(TOASTER_STATUS.ERROR, 'Please upload image file');
        }
      }

      if (handleDragDropStyle) {
        handleDragDropStyle(false);
      }
    }
  };
  const handleResetFile = () => {
    if (bannerUploadRef.current) {
      bannerUploadRef.current.files = null;
      bannerUploadRef.current.value = '';
    }
  };
  const changeInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Use optional chaining to access files[0]
    const selectedFile: File | undefined = event.currentTarget.files?.[0];

    if (isAudio) {
      if (selectedFile?.type?.split('/')[0] === 'audio') {
        if (selectedFile && selectedFile.size < 1024) {
          handleResetFile();
          showToastMessage(
            TOASTER_STATUS.ERROR,
            'File size should be more than 1KB',
          );
        } else if (maxDuration && maxDuration > 0) {
          validateAudioWithDuration(
            selectedFile,
            maxFileSize,
            maxDuration,
          ).then((response) => {
            if (typeof response === 'string') {
              handleResetFile();
              showToastMessage(TOASTER_STATUS.ERROR, response);
            } else {
              handleFile(selectedFile);
            }
          });
        } else {
          const result = validateAudio(selectedFile, maxFileSize);

          if (typeof result === 'string') {
            handleResetFile();
            showToastMessage(TOASTER_STATUS.ERROR, result);
          } else {
            handleFile(selectedFile);
          }
        }
      } else {
        handleResetFile();
        showToastMessage(TOASTER_STATUS.ERROR, 'Please upload audio file');
      }
    } else if (selectedFile?.type?.split('/')[0] === 'image') {
      if (selectedFile && checkSize(selectedFile.size, maxFileSize)) {
        setSrc(URL.createObjectURL(selectedFile));
        handleFile(selectedFile);
      } else {
        handleResetFile();
        showToastMessage(
          TOASTER_STATUS.ERROR,
          maxFileSize
            ? `File size should not be more than ${maxFileSize}${sizeIn ?? ''}`
            : 'File size too large',
        );
      }
    } else {
      handleResetFile();
      showToastMessage(TOASTER_STATUS.ERROR, 'Please upload image file');
    }
  };

  const handleResize = (value: any) => {
    handleFile(value);
    setSrc(null);
  };

  const handleDragEnter = () => {
    if (handleDragDropStyle) {
      handleDragDropStyle(true);
    }
  };

  const handleDragLeave = () => {
    if (handleDragDropStyle) {
      handleDragDropStyle(false);
    }
  };

  return (
    <>
      {/* eslint-disable-next-line */}
      <div
        className={`drop-zone p-3 ${disabled ? 'cursor-not-allowed' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => bannerUploadRef?.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <span className='mb-2'>{icon}</span>
        {content === '' ? (
          <span className='drop-zone__prompt d-block'>
            Click to upload or drag and drop
            {width && height ? (
              <>
                <br />
                Please upload (
                {`${width}x${height}`}
                ) resolution file
              </>
            ) : null}
            {isAudio && !!maxDuration && (
              <>
                <br />
                {` Max audio duration limit ${getMinutesFromSeconds(maxDuration)
                  .replace('min', 'Minutes')
                  .replace('sec', 'Seconds')}.`}
              </>
            )}
            {maxFileSize && (
              <>
                <br />
                {` Max file size ${maxFileSize} ${sizeIn ?? ''}.`}
              </>
            )}
          </span>
        ) : (
          <span className='content'>
            {content}
            <span className='subcontent'>{subContent}</span>
          </span>
        )}
        <input
          hidden
          type='file'
          ref={bannerUploadRef}
          className='drop-zone__input'
          name={name}
          accept={accept}
          onChange={changeInputFile}
          disabled={disabled}
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

DragDropFile.defaultProps = {
  disabled: false,
  content: '',
  subContent: '',
  isAudio: false,
  maxDuration: 0,
  handleDragDropStyle: () => {},
  sizeIn: 'MB',
};

export default DragDropFile;
