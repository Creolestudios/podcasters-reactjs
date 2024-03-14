import React, { ChangeEvent, FC } from 'react';
import moment from 'moment';
import ButtonWrapper from '../form/ButtonWrapper';
import FormGroupWrapper from '../form/FormGroupWrapper';
import IconWrapper from '../IconWrapper';
import { convertDateTimeFromUnix } from '../../utils';

import SvgIcons from '../../assets/svg/SvgIcons';
import { ISchedule } from '../../types';

import './index.scss';

interface IProps {
  handleIsScheduled: () => void;
  handleChange: (value: ISchedule) => void;
  dateError?: string;
  dateTouched?: boolean;
  timeError?: string;
  timeTouched?: boolean;
  onSchedule: () => void;
  buttonType: 'button' | 'submit' | 'reset';
  dateValue: string;
  timeValue: string;
  isScheduled?: boolean;
  isSubmitting: boolean;
  isCancelHide?: boolean;
}

export const CalenderElement: FC<{ iconType: string }> = ({ iconType }) => (
  <div className='calendar-icon'>
    <IconWrapper IconName={SvgIcons} iconType={iconType} />
  </div>
);

const DateTimeScheduleWrapper: FC<IProps> = ({
  handleIsScheduled,
  handleChange,
  dateError,
  dateTouched,
  timeError,
  timeTouched,
  onSchedule,
  buttonType,
  dateValue,
  timeValue,
  isScheduled,
  isCancelHide,
  isSubmitting,
}) => {
  const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.name === 'date') {
      handleChange({
        time: timeValue,
        date: evt.target.value,
      });
    } else if (evt.target.name === 'time') {
      handleChange({
        time: evt.target.value,
        date: dateValue,
      });
    }
  };

  return (
    <div className='date-time-schedule-wrapper'>
      <div className='row mb-4 mb-lg-0'>
        {!isScheduled ? (
          <div className='col-lg-6'>
            <div className='form-margin form-btn'>
              <ButtonWrapper
                onClick={handleIsScheduled}
                className='btn-primary reject-btn w-100'
                isDisabled={isSubmitting}
              >
                Schedule
              </ButtonWrapper>
            </div>
          </div>
        ) : (
          <div className='form-margin form-btn mb-0'>
            <div className='calendar-container w-100'>
              <FormGroupWrapper
                label='Date'
                name='date'
                type='date'
                error={dateTouched ? dateError : undefined}
                value={dateValue}
                onChange={onChange}
                elementRender={<CalenderElement iconType='date-picker-icon' />}
                min={convertDateTimeFromUnix(moment().unix(), 'YYYY-MM-DD')}
              />
            </div>
            <div className='calendar-container w-100'>
              <FormGroupWrapper
                label='Time'
                name='time'
                type='time'
                error={timeTouched ? timeError : undefined}
                value={timeValue}
                onChange={onChange}
                elementRender={<CalenderElement iconType='time-picker-icon' />}
                min={
                  dateValue
                  === convertDateTimeFromUnix(moment().unix(), 'YYYY-MM-DD')
                    ? convertDateTimeFromUnix(moment().unix(), 'HH:mm')
                    : undefined
                }
              />
            </div>
          </div>
        )}
      </div>

      {!isSubmitting && isScheduled && (
        <div className='row mb-4 mb-lg-0'>
          <div className='col-lg-12'>
            <div className='form-margin form-btn'>
              <ButtonWrapper onClick={onSchedule} type={buttonType}>
                Save
              </ButtonWrapper>
              {!isCancelHide && (
                <ButtonWrapper
                  onClick={handleIsScheduled}
                  className='btn-primary reject-btn'
                >
                  Cancel
                </ButtonWrapper>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

DateTimeScheduleWrapper.defaultProps = {
  dateError: undefined,
  dateTouched: false,
  timeError: undefined,
  timeTouched: false,
  isScheduled: false,
  isCancelHide: false,
};

export default DateTimeScheduleWrapper;
