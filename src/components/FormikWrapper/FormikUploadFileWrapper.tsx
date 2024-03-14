import React, { FC } from 'react';
import { useField } from 'formik';
import UploadFileWrapper, { IUploadFileProps } from '../form/UploadFileWrapper';
import { getImageFileResolution } from '../../utils';

const FormikUploadFileWrapper: FC<
  Omit<IUploadFileProps, 'handleFile' | 'value' | 'handleRemove'>
> = ({
  columns, accept, maxFileSize, sizeIn, height, width, label, name, disabled, required,
}) => {
  const [field, meta, helpers] = useField({ name });

  const onChange = (evt: File | Blob) => {
    getImageFileResolution(evt, (resolution: string) => {
      if (resolution === `${width}x${height}`) {
        helpers.setValue(evt);
      }
    });
  };

  const onRemove = () => helpers.setValue(null);

  return (
    <UploadFileWrapper
      columns={columns}
      accept={accept}
      handleFile={onChange}
      maxFileSize={maxFileSize}
      sizeIn={sizeIn}
      height={height}
      width={width}
      label={label}
      value={field.value}
      name={field.name}
      handleRemove={onRemove}
      error={meta.error}
      touched={meta.touched}
      disabled={disabled}
      required={required}
    />
  );
};

export default FormikUploadFileWrapper;
