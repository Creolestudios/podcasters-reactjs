import React, { FC } from 'react';
import { useField } from 'formik';
import DateTimeScheduleWrapper from '../DateTimeScheduleWrapper';
import { ISchedule } from '../../types';

interface IProps {
  handleHasScheduled: () => void;
  name: string;
  isScheduled: boolean;
  isSubmitting: boolean;
  isCancelHide?: boolean;
}

const FormikDateTimeSchedule: FC<IProps> = ({
  handleHasScheduled,
  name,
  isScheduled,
  isCancelHide,
  isSubmitting,
}) => {
  const [dateField, dateMeta, date] = useField({ name: 'date' });
  const [timeField, timeMeta, time] = useField({ name: 'time' });
  const [scheduleField, scheduleMeta, schedule] = useField({ name });

  const onChange = (value: ISchedule) => {
    date.setValue(value.date);
    time.setValue(value.time);
  };

  const onSchedule = () => schedule.setValue('scheduled');

  return (
    <DateTimeScheduleWrapper
      handleChange={onChange}
      handleIsScheduled={handleHasScheduled}
      dateError={dateMeta.error}
      dateTouched={dateMeta.touched}
      timeError={timeMeta.error}
      timeTouched={timeMeta.touched}
      buttonType='submit'
      onSchedule={onSchedule}
      dateValue={dateField.value}
      timeValue={timeField.value}
      isScheduled={isScheduled}
      isCancelHide={isCancelHide}
      isSubmitting={isSubmitting}
    />
  );
};

FormikDateTimeSchedule.defaultProps = {
  // handleHasScheduled: () => {},
  isCancelHide: true,
};

export default FormikDateTimeSchedule;
