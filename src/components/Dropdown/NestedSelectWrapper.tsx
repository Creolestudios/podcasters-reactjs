import React, {
  FC, useState, useEffect, useCallback,
} from 'react';
import { Button } from 'react-bootstrap';

import IconWrapper from '../IconWrapper';
import { getInTitleCase } from '../../utils';

import { ISelectItem } from '../../types';
import './nested-select-wrapper.scss';

export interface INestedSelectItem extends ISelectItem {
  hasSubMenu: boolean;
  paramsLabel?: string;
}

interface IProps {
  items: INestedSelectItem[];
  placeholder?: string;
  hasIcon?: boolean;
  iconType?: string;
  IconName?: any;
  onSelect: (item: string, parentItem?: any) => void; // eslint-disable-line
  subMenu: any;
  reset: () => void;
}

const NestedSelectWrapper: FC<IProps> = ({
  items,
  placeholder,
  hasIcon,
  iconType,
  IconName,
  onSelect,
  subMenu,
  reset,
}) => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setValue(placeholder ?? '');
  }, []);

  const handleValue = useCallback(
    (item: INestedSelectItem, subItem?: any) => {
      if (item.hasSubMenu) {
        if (typeof subItem === 'string') {
          setValue(getInTitleCase(subItem));
          onSelect(subItem, item);
        } else {
          setValue(getInTitleCase(subItem.name));
          onSelect(subItem.uuid, item);
        }
      } else {
        setValue(getInTitleCase(item.value));
        onSelect(item.value, item);
      }
    },
    [value],
  );

  const handleReset = () => {
    setValue(placeholder ?? '');
    reset();
  };

  return (
    <div className='editor-audio-page m-0 nested-select-container'>
      <div className='editor-audio-menu p-0'>
        <div className='d-lg-flex block flex-wrap'>
          <div className='me-0 me-lg-3 container'>
            <Button
              className='nav-link dropdown-toggle d-flex align-items-center'
              data-bs-toggle='dropdown'
            >
              {hasIcon && (
                <IconWrapper iconType={iconType} IconName={IconName} />
              )}
              {value}
            </Button>
            <ul className='dropdown-menu dropdown-menu-list'>
              <li>
                <Button className='dropdown-item' onClick={handleReset}>
                  Reset Filter
                </Button>
                <div className='border-bottom-b-d' />
              </li>
              {items
                && items.length > 0
                && items.map((item: INestedSelectItem, index: number) => (
                  <li key={item.label}>
                    {!item.hasSubMenu ? (
                      <Button
                        className='dropdown-item'
                        onClick={() => handleValue(item)}
                      >
                        {getInTitleCase(item.label)}
                      </Button>
                    ) : (
                      <>
                        <Button className='dropdown-item'>
                          {getInTitleCase(item.label)}
                        </Button>

                        <div className='submenu-wrapper'>
                          <ul className='submenu'>
                            {subMenu[item.value]?.length > 0
                              && subMenu[item.value]?.map(
                                (subItem: any, subIndex: number) => (typeof subItem === 'string' ? (
                                  <li className='dropdown-item' key={subItem}>
                                    <Button
                                      className='dropdown-item'
                                      onClick={() => handleValue(item, subItem)}
                                    >
                                      {getInTitleCase(subItem)}
                                    </Button>
                                    {subIndex
                                        < subMenu[item.value].length - 1 && (
                                        <div className='border-bottom-b-d' />
                                    )}
                                  </li>
                                ) : (
                                  <li
                                    className='dropdown-item'
                                    key={subItem.uuid}
                                  >
                                    <Button
                                      className='dropdown-item'
                                      onClick={() => handleValue(item, subItem)}
                                    >
                                      {getInTitleCase(subItem.name)}
                                    </Button>
                                    {subIndex
                                        < subMenu[item.value].length - 1 && (
                                        <div className='border-bottom-b-d' />
                                    )}
                                  </li>
                                )),
                              )}
                          </ul>
                        </div>
                      </>
                    )}

                    {index < items.length - 1 && (
                      <div className='border-bottom-b-d' />
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

NestedSelectWrapper.defaultProps = {
  hasIcon: false,
  iconType: '',
  IconName: null,
  placeholder: '',
};

export default NestedSelectWrapper;
