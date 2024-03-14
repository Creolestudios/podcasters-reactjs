import React, { ChangeEvent } from 'react';
import { useField } from 'formik';
import moment from 'moment';
import FormGroupWrapper from '../../../components/form/FormGroupWrapper';
import { CalenderElement } from '../../../components/DateTimeScheduleWrapper';
import { convertDateTimeFromUnix } from '../../../utils';

interface DateAndTimeSectionProps {
  dateLabel: string;
  timeLabel: string;
  dateField: string;
  timeField: string;
}

const DateAndTimeSection = ({
  dateLabel,
  timeLabel,
  dateField: propsDateFiled,
  timeField: propsTimeFiled,
}: DateAndTimeSectionProps) => {
  const [dateField, dateMeta, date] = useField({
    name: propsDateFiled,
  });
  const [timeField, timeMeta, time] = useField({
    name: propsTimeFiled,
  });

  return (
    <div className='row'>
      <div className='col-lg-6 calendar-container'>
        <FormGroupWrapper
          label={dateLabel}
          name='date'
          type='date'
          error={dateMeta.touched ? dateMeta.error : ''}
          value={dateField.value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => date.setValue(e.target.value)}
          elementRender={<CalenderElement iconType='date-picker-icon' />}
          min={convertDateTimeFromUnix(moment().unix(), 'YYYY-MM-DD')}
          required
        />
      </div>
      <div className='col-lg-6 calendar-container'>
        <FormGroupWrapper
          label={timeLabel}
          name='time'
          type='time'
          error={timeMeta.touched ? timeMeta.error : ''}
          value={timeField.value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => time.setValue(e.target.value)}
          elementRender={<CalenderElement iconType='time-picker-icon' />}
          required
        />
      </div>
    </div>
  );
};

export default DateAndTimeSection;
