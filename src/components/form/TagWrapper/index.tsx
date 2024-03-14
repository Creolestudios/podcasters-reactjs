import React, {
  ChangeEvent, FC, useCallback, useState, useRef,
} from 'react';
import IconButtonWrapper from '../../IconButtonWrapper';

import RemoveIcon from '../../../assets/svg/RemoveIcon';
import './index.scss';
import { showToastMessage, validateHtmlTag } from '../../../utils';
import { TOASTER_STATUS } from '../../../constant';

export interface ITag {
  key: number;
  value: string;
}

export interface ITagWrapperProps {
  label: string;
  name: string;
  tags: ITag[] | [];
  handleChange: (value: ITag[]) => void;
  placeholder: string;
  error?: string | undefined;
}

const TagWrapper: FC<ITagWrapperProps> = ({
  label,
  name,
  tags,
  handleChange,
  placeholder,
  error,
}) => {
  const [textValue, setTextValue] = useState<string>('');
  const [focus, setFocus] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClickOnTagDiv = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  const getTagsValue = () => tags?.map((tag: ITag) => tag?.value);
  const resetTagsKey = (tagItems: ITag[]) => {
    const _tags = tagItems?.map((tag: ITag, index: number) => ({
      ...tag,
      key: index,
    }));

    return _tags;
  };

  const onChange = (evt: ChangeEvent<HTMLInputElement>) => setTextValue(evt.target.value);
  const onMouseEnter = () => setFocus(true);
  const onMouseLeave = () => setFocus(false);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;
      let { value } = e.currentTarget;

      if (value) {
        const trimmedValue = value?.toLocaleLowerCase()?.trim();
        if (
          (key === 'Enter' && getTagsValue()?.includes(trimmedValue))
          || (key === 'Tab' && getTagsValue()?.includes(trimmedValue))
        ) {
          e?.preventDefault();
          showToastMessage(TOASTER_STATUS.ERROR, 'Tag already exists.');
        }

        if (
          (key === 'Enter' && trimmedValue?.length && !getTagsValue()?.includes(trimmedValue))
          || (key === 'Tab' && trimmedValue?.length && !getTagsValue()?.includes(trimmedValue))
        ) {
          e?.preventDefault();

          if (validateHtmlTag(trimmedValue)) {
            showToastMessage(
              TOASTER_STATUS.ERROR,
              'For security reasons, HTML tags are not allowed',
            );
          } else if (getTagsValue()?.length >= 15) {
            showToastMessage(TOASTER_STATUS.ERROR, 'You can add up to 15 tags');
          } else {
            handleChange([...tags, { key: tags.length + 1, value: trimmedValue }]);
            setTextValue('');
          }
        }

        if (key === 'Enter') {
          value = '';
        }
      }
      if (!value) {
        if (key === 'Backspace') {
          tags.pop();
          handleChange(resetTagsKey(tags));
        }
      }
    },
    [tags],
  );

  const onRemove = useCallback(
    (tag: ITag) => {
      const _tags = tags.filter((_tag: ITag) => _tag.key !== tag.key && _tag.value !== tag.value);

      handleChange(resetTagsKey(_tags));
    },
    [tags],
  );

  return (
    <div className='row tag-wrapper'>
      <div className='col-lg-12'>
        <label htmlFor={name} className='position-relative'>
          <div className='form-field-label'>{label}</div>
          {/* eslint-disable-next-line */}
          <div
            className={`tag-box flex-wrap d-flex gap-2 align-items-center mb-3 ${focus && 'focus'}`}
            id={name}
            onClick={handleClickOnTagDiv}
          >
            {tags?.length > 0
              && tags.map((tag: ITag) => (
                <div
                  className={`d-flex position-relative ${tag.value.length > 50 ? 'w-100' : ''}`}
                  key={tag.key}
                >
                  <span className='tag text-truncate'>{tag.value}</span>
                  <IconButtonWrapper
                    className='close-tag-text'
                    IconName={RemoveIcon}
                    onClick={() => onRemove(tag)}
                  />
                </div>
              ))}
            <input
              className='input-tag h-50 w-fit m-0'
              placeholder={placeholder}
              value={textValue}
              ref={inputRef}
              onKeyDown={onKeyDown}
              onChange={onChange}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          </div>
          {error && (
            <div className='text-danger position-absolute fs-6 fw-normal error'>{error}</div>
          )}
        </label>
      </div>
    </div>
  );
};

TagWrapper.defaultProps = {
  error: undefined,
};

export default TagWrapper;
