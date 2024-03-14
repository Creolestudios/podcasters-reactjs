import React, { FC, useEffect, ChangeEvent } from 'react';

import './index.scss';

interface IProps {
  value: string;
  onChange: (value: string) => void;
  id: string;
  disabled: boolean;
  leftProgressColor: string;
  rightProgressColor: string;
  min: string | number;
  max: string | number;
  step: string | number;
}

const RangeSlider: FC<IProps> = ({
  value,
  onChange,
  id,
  disabled,
  leftProgressColor,
  rightProgressColor,
  min,
  max,
  step,
}) => {
  const setBackground = (rangeValue: string) => {
    const inputElement: HTMLInputElement | null = document.querySelector(
      `#${id}`,
    );

    if (inputElement) {
      const { max } = inputElement;
      const progress = (Number(rangeValue) / Number(max)) * 100;
      const background = `linear-gradient(to right, ${leftProgressColor} ${progress}%, ${rightProgressColor} ${progress}%)`;

      inputElement.style.background = background;
    }
  };

  useEffect(() => {
    setBackground(value);
  }, [value]);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setBackground(evt.target.value);
    onChange(evt.target.value);
  };

  return (
    <div className='wrapper'>
      <div className='range'>
        <input
          type='range'
          min={min}
          max={max}
          value={value}
          id={id}
          onChange={handleChange}
          disabled={disabled}
          step={step}
        />
      </div>
    </div>
  );
};

export default RangeSlider;
