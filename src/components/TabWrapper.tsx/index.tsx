import React, { ReactElement } from 'react';
import { Tab, Tabs } from 'react-bootstrap';

import './index.scss';

interface ITabItem {
  key: string;
  title: string;
  children: ReactElement | string | null;
}

interface IProps {
  items: ITabItem[] | [];
  defaultActiveKey: string;
  id: string;
  onSelect?: (item: any) => void;
}

const TabWrapper: React.FC<IProps> = ({
  items, defaultActiveKey, id, onSelect,
}) => (
  <Tabs
    defaultActiveKey={defaultActiveKey}
    id={id}
    className='mb-3 tab-wrapper'
    onSelect={onSelect}
  >
    {items?.length > 0
      && items.map((item: ITabItem) => (
        <Tab eventKey={item.key} title={item.title} key={item.key}>
          {item.children}
        </Tab>
      ))}
  </Tabs>
);

TabWrapper.defaultProps = {
  onSelect: () => {},
};

export default TabWrapper;
