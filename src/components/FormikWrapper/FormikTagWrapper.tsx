import React, { FC } from 'react';
import { useField } from 'formik';
import TagWrapper, { ITagWrapperProps, ITag } from '../form/TagWrapper';

const FormikTagWrapper: FC<Omit<ITagWrapperProps, 'handleChange' | 'tags'>> = ({
  name,
  label,
  placeholder,
}) => {
  const [field, _, helpers] = useField({ name });

  const onChange = (tags: ITag[]) => helpers.setValue(tags);

  const getError = () => {
    if (field.value.length > 15) {
      return 'You can add up to 15 tags';
    }

    if (
      field.value?.filter((item: ITag) => item.value.length > 50).length > 0
    ) {
      return 'Each tag must be between 1 and 50 characters';
    }
    return undefined;
  };

  return (
    <TagWrapper
      name={name}
      label={label}
      placeholder={placeholder}
      tags={field.value}
      handleChange={onChange}
      error={getError()}
    />
  );
};

export default FormikTagWrapper;
