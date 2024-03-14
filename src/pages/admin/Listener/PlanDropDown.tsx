import React, {
  FC, useState, useEffect, useCallback,
} from 'react';
import { Button } from 'react-bootstrap';
import { ISelectedPlan } from './AdminListener';

interface IProps {
  items: ISelectedPlan[];
  selectedItem?: ISelectedPlan;
  placeholder?: string;
  onSelect: (item: any) => void;
}

const PlanDropDown: FC<IProps> = ({
  items, selectedItem, placeholder, onSelect,
}) => {
  const [value, setValue] = useState<any>({});

  useEffect(() => {
    setValue(placeholder ?? '');
  }, []);

  const handleValue = useCallback(
    (itemValue: any) => {
      setValue(itemValue);
      onSelect(itemValue);
    },
    [value],
  );

  useEffect(() => {
    handleValue(selectedItem);
  }, [selectedItem]);

  return (
    <div className='editor-audio-page m-0'>
      <div className='editor-audio-menu p-0'>
        <div className='d-lg-flex block flex-wrap'>
          <div className='me-0 me-lg-3'>
            <Button
              className='nav-link dropdown-toggle d-flex align-items-center details'
              data-bs-toggle='dropdown'
            >
              <span className='plan-name'>{value.label}</span>
              <span>|</span>
              <span className='price'>{value.price}</span>
              <span className='period'>{value.period}</span>
            </Button>
            <ul className='dropdown-menu'>
              {items
                && items.length > 0
                && items.map((item: any, index: number) => (
                  <li key={item.label}>
                    <Button className='dropdown-item details' onClick={() => handleValue(item)}>
                      <span className='plan-name'>{item.label}</span>
                      <span>|</span>
                      <span className='price'>{item.price}</span>
                      <span className='period'>{item.period}</span>
                    </Button>
                    {index < items.length - 1 && <div className='border-bottom-b-d' />}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

PlanDropDown.defaultProps = {
  placeholder: '',
  selectedItem: {
    label: '',
    value: '',
    price: 0,
    period: '',
  },
};

export default PlanDropDown;
