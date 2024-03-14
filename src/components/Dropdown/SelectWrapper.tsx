import React, {
  FC, useState, useEffect, useCallback,
} from 'react';
import { Button } from 'react-bootstrap';

import IconWrapper from '../IconWrapper';
import { getInTitleCase } from '../../utils';
import SearchInputWrapper from '../SearchInputWrapper';

import { ISelectItem } from '../../types';
import './select-wrapper.scss';

interface IProps {
  items: ISelectItem[];
  selectedItem?: ISelectItem;
  placeholder?: string;
  hasIcon?: boolean;
  iconType?: string;
  IconName?: any;
  onSelect: (item: string | any) => void; // eslint-disable-line
  hasSearch?: boolean;
  hasBoarder?: boolean;
  isExportAs?: boolean;
  formatList?: string[] | [];
  qualityList?: string[] | [];
  isDisabled?: boolean;
}

const SelectWrapper: FC<IProps> = ({
  items,
  selectedItem,
  placeholder,
  hasIcon,
  iconType,
  IconName,
  onSelect,
  hasSearch,
  hasBoarder,
  isExportAs,
  formatList,
  qualityList,
  isDisabled,
}) => {
  const [value, setValue] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [selectItems, setSelectItems] = useState<ISelectItem[] | []>([]);
  const [dataToggle, setDataToggle] = useState('dropdown');
  const [exportAudio, setExportAudio] = useState<any>({
    format: 'MP3',
    quality: '160 kbps',
  });

  useEffect(() => {
    setValue(placeholder ?? '');
    if (hasSearch) {
      setSelectItems(items);
    }
  }, []);

  const handleValue = useCallback(
    (item: ISelectItem) => {
      setValue(getInTitleCase(item.value));
      onSelect(Object.keys(item).includes('key') ? item : item.value);
    },
    [value],
  );

  useEffect(() => {
    if (selectedItem?.value !== '') {
      handleValue(
        selectedItem ?? {
          label: '',
          value: '',
        },
      );
    }
  }, [selectedItem]);

  useEffect(() => {
    if (hasSearch) {
      const newItems = items.filter((item: ISelectItem) => {
        const itemLabel = item.label.toLowerCase();

        return itemLabel.includes(search.toLowerCase());
      });
      setSelectItems(newItems);
    }
  }, [search]);

  const handleSearch = (value: string) => setSearch(value);
  const handleClick = () => {
    if (hasSearch) {
      setSearch('');
    }
  };

  const getExportAudioQualityClassName = (value: string) => {
    let className = '';

    if (exportAudio.quality === value) {
      className += 'active';
    }

    if (value === '320 kbps') {
      className += ' kbps';
    }

    return className;
  };

  const onFormat = (value: string) => {
    setDataToggle('');
    setExportAudio({ ...exportAudio, format: value });
  };
  const onQuality = (value: string) => {
    setDataToggle('');
    setExportAudio({ ...exportAudio, quality: value });
  };
  const onExportAudio = () => {
    setDataToggle('dropdown');
    onSelect(exportAudio);
  };

  return (
    <div className='editor-audio-page m-0 select-wrapper-wrapper'>
      <div className='editor-audio-menu p-0'>
        <div className='d-lg-flex block flex-wrap'>
          <div className='me-0 me-lg-3'>
            <Button
              className={`nav-link dropdown-toggle d-flex align-items-center ${
                isExportAs && 'export-audio-dropdown'
              }`}
              data-bs-toggle={isExportAs ? dataToggle : 'dropdown'}
              onClick={handleClick}
              disabled={isDisabled}
            >
              {hasIcon && (
                <IconWrapper iconType={iconType} IconName={IconName} />
              )}
              {value}
            </Button>
            <div className={`dropdown-menu ${isExportAs && 'export-as'}`}>
              {hasSearch && !isExportAs && (
                <div className='search-list-item'>
                  <SearchInputWrapper
                    searchValue={search}
                    handleSearch={handleSearch}
                  />
                </div>
              )}

              <ul>
                {!hasSearch
                  && !isExportAs
                  && items
                  && items.length > 0
                  && items.map((item: ISelectItem, index: number) => (
                    <li
                      key={item.label}
                      className={!hasBoarder ? 'm-b-15' : ''}
                    >
                      <Button
                        className='dropdown-item'
                        onClick={() => handleValue(item)}
                      >
                        {item?.icon && item.icon}
                        {getInTitleCase(item.label)}
                      </Button>
                      {index < items.length - 1 && hasBoarder && (
                        <div className='border-bottom-b-d' />
                      )}
                    </li>
                  ))}

                {hasSearch
                  && !isExportAs
                  && selectItems?.length > 0
                  && selectItems.map((item: ISelectItem, index: number) => (
                    <li
                      key={item.label}
                      className={
                        !hasBoarder
                        && item.value.toLowerCase() === value.toLowerCase()
                          ? 'm-b-15 active-selected-item'
                          : ''
                      }
                    >
                      <Button
                        className='dropdown-item'
                        onClick={() => handleValue(item)}
                      >
                        {item?.icon && item.icon}
                        {getInTitleCase(item.label)}
                      </Button>
                      {index < items.length - 1 && hasBoarder && (
                        <div className='border-bottom-b-d' />
                      )}
                    </li>
                  ))}

                {!hasSearch && isExportAs && (
                  <li>
                    <div className='format'>
                      <p>Format</p>
                      <div className='d-flex flex-wrap'>
                        {formatList
                          && formatList?.length > 0
                          && formatList?.map((item: string) => (
                            // eslint-disable-next-line
                            <span
                              key={item}
                              onClick={() => onFormat(item)}
                              className={
                                exportAudio.format === item ? 'active' : ''
                              }
                            >
                              {item}
                            </span>
                          ))}
                      </div>
                      <div className='border-bottom-b-d' />

                      <p>Quality</p>
                      <div className='d-flex flex-wrap'>
                        {qualityList
                          && qualityList?.length > 0
                          && qualityList?.map((item: string) => (
                            // eslint-disable-next-line
                            <span
                              key={item}
                              className={getExportAudioQualityClassName(item)}
                              onClick={() => onQuality(item)}
                            >
                              {item}
                            </span>
                          ))}
                      </div>

                      <button
                        type='button'
                        className='btn-style btn-primary btn-bg w-100 mt-4'
                        onClick={onExportAudio}
                      >
                        Export Audio
                      </button>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SelectWrapper.defaultProps = {
  hasIcon: false,
  iconType: '',
  IconName: null,
  placeholder: '',
  selectedItem: {
    label: '',
    value: '',
  },
  hasSearch: false,
  hasBoarder: true,
  isDisabled: false,
};

export default SelectWrapper;
