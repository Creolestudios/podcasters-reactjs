import React, { FC } from 'react';
import DragDropFile from '../../DragAndDrop/DragDropFile';
import IconButtonWrapper from '../../IconButtonWrapper';

import File from '../../../assets/svg/File';
import RemoveIcon from '../../../assets/svg/RemoveIcon';

import './index.scss';

export interface IUploadFileProps {
  columns: string;
  accept: string;
  handleFile: (e: any) => void;
  maxFileSize: number;
  height: number;
  width: number;
  label: string;
  value: Blob | null | string;
  name: string;
  handleRemove: () => void;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  required?: boolean;
  sizeIn?: string;
}

const UploadFileWrapper: FC<IUploadFileProps> = ({
  columns,
  accept,
  handleFile,
  maxFileSize,
  sizeIn,
  height,
  width,
  label,
  value,
  name,
  handleRemove,
  error,
  touched,
  disabled,
  required,
}) => (
  <div className={`${columns} form-style upload-file-wrapper m-b-5`} id={name}>
    <div className='h-100 mb-1 position-relative'>
      <div className='form-field-label'>
        {label}
        {required && <span className='required red'>*</span>}
      </div>
      {value ? (
        <div className='h-189 w-100'>
          <div className='position-relative h-100'>
            {!disabled && (
              <IconButtonWrapper
                IconName={RemoveIcon}
                onClick={handleRemove}
                className='close-banner'
              />
            )}
            <img
              src={typeof value === 'string' ? value : URL.createObjectURL(value)}
              alt={name}
              className='image-view img-fluid'
            />
          </div>
        </div>
      ) : (
        <div className='h-189 w-100'>
          <DragDropFile
            accept={accept}
            handleFile={handleFile}
            icon={<File />}
            maxFileSize={maxFileSize}
            sizeIn={sizeIn}
            height={height}
            width={width}
            disabled={disabled}
          />
        </div>
      )}
      {error && touched && (
        <span className='text-danger position-absolute fs-6 fw-normal error'>{error}</span>
      )}
    </div>
  </div>
);

UploadFileWrapper.defaultProps = {
  error: undefined,
  touched: false,
  disabled: false,
  required: false,
  sizeIn: 'MB',
};

export default UploadFileWrapper;
