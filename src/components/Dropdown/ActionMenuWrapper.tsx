import React, { ReactComponentElement, ReactElement, useState } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import IconWrapper from '../IconWrapper';
import { getTitle } from '../../utils';
import { IActionMenuitem } from '../../types';

import './action-menu-wrapper.scss';

export interface IConditionalItem {
  key: string;
  value: string;
  actionItemKey: string;
  iconType?: string;
  IconName?: any;
}

interface IDisabled {
  [key1: string]: boolean;
}
interface IHidden {
  [key: string]: boolean;
}
interface IProps {
  MenuIcon: any;
  items: IActionMenuitem[];
  slugId: string;
  id?: string;
  hasDivider?: boolean;
  onClick?: (Value: string) => void;
  conditionalItem?: IConditionalItem;
  disabled?: IDisabled;
  hidden?: IHidden;
  checkActionMenuIsOpen?: CallableFunction;
}

const ActionMenuWrapper: React.FC<IProps> = ({
  MenuIcon,
  items,
  slugId,
  id,
  hasDivider,
  onClick,
  conditionalItem,
  disabled,
  hidden,
  checkActionMenuIsOpen,
}) => {
  const navigate = useNavigate();
  const [show, setShow] = useState<boolean>(false);

  const getRedirectUrl = (url: string, slug: string | null) => {
    if (slug) {
      const slugList = slug.split('/');

      switch (true) {
        case slugList.includes(':podcastSlug'):
          return slug.replace(':podcastSlug', slugId);
        default:
          return `${url}/${slugId}`;
      }
    }
    return `${url}/${slugId}`;
  };

  const handleRedirect = (url: string, slug: string | null) => {
    const _url = getRedirectUrl(url, slug);
    navigate(_url, { state: { podcastId: id, slug } });
  };

  const handleClick = (value: string) => {
    if (onClick) {
      onClick(value);
    }
  };

  const getDisabledValue = (label: string) => {
    if (disabled) {
      if (Object.keys(disabled).includes(label.toLowerCase())) {
        return disabled[label];
      }
      return false;
    }
    return false;
  };

  const hiddenElement = (label: string) => {
    if (hidden) {
      if (Object.keys(hidden).includes(label.toLowerCase())) {
        return hidden[label];
      }
      return false;
    }
    return false;
  };

  return (
    <NavDropdown
      title={<MenuIcon />}
      id='action-menu-dropdown'
      className='dropdown dropstart action-menu'
      show={show}
      onToggle={(isOpen: boolean, metadata: any) => {
        if (metadata.source !== 'select') {
          setShow(isOpen);
          if (checkActionMenuIsOpen) checkActionMenuIsOpen(isOpen);
        }
      }}
    >
      {items
        && items.length > 0
        && items.map((item: IActionMenuitem, index: number) => (
          <div
            key={
              conditionalItem?.actionItemKey?.toLowerCase()
              === item.label.toLowerCase()
                ? conditionalItem.key
                : item.label
            }
            className='dropdown-menu-item'
          >
            {item.isButton ? (
              <Button
                className={`btn py-1 w-100 text-start btn-action ${
                  hiddenElement(item?.label) && 'd-none'
                }`}
                onClick={() => {
                  handleClick(
                    conditionalItem?.actionItemKey?.toLowerCase()
                      === item.label.toLowerCase()
                      ? conditionalItem.key
                      : item.label,
                  );
                  setShow(false);
                }}
                disabled={getDisabledValue(item.label)}
              >
                {item.hasIcon && (
                  <IconWrapper
                    iconType={
                      conditionalItem?.actionItemKey?.toLowerCase()
                      === item.label.toLowerCase()
                        ? conditionalItem.iconType
                        : item.iconType
                    }
                    IconName={
                      conditionalItem?.actionItemKey?.toLowerCase()
                      === item.label.toLowerCase()
                        ? conditionalItem.IconName
                        : item.IconName
                    }
                  />
                )}
                <span>
                  {conditionalItem?.actionItemKey?.toLowerCase()
                  === item.label.toLowerCase()
                    ? getTitle(conditionalItem.key)
                    : getTitle(item.label)}
                </span>
              </Button>
            ) : (
              <Button
                onClick={() => handleRedirect(item.url, item.slug ?? null)}
                className='btn py-1 w-100 text-start btn-action'
              >
                {item.hasIcon && (
                  <IconWrapper
                    iconType={item.iconType}
                    IconName={item.IconName}
                  />
                )}
                <span>{getTitle(item.label)}</span>
              </Button>
            )}

            {index < items.length - 1 && hasDivider && <NavDropdown.Divider />}
          </div>
        ))}
    </NavDropdown>
  );
};

ActionMenuWrapper.defaultProps = {
  id: '',
  hasDivider: true,
  onClick: () => {},
  conditionalItem: undefined,
  disabled: undefined,
  hidden: undefined,
  checkActionMenuIsOpen: () => {},
};

export default ActionMenuWrapper;
