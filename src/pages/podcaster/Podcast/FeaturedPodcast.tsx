import React, { FC, useState } from 'react';
import moment from 'moment';
import FormikWrapper from '../../../components/FormikWrapper';
import FormikFieldWrapper from '../../../components/FormikWrapper/FormikFieldWrapper';
import { CalenderElement } from '../../../components/DateTimeScheduleWrapper';
import { convertDateTimeFromUnix } from '../../../utils';
import { featuredPodcastSchema } from '../../../utils/formValidationSchema';
import { setFeaturedPodcast } from '../../../services/podcaster/Podcast';

import '../../../assets/scss/podcast-page.scss';
import { IOpen } from './PodcastPage';
import Loader from '../../../components/Loader/Loader';

interface ISchedule {
  startDate: string;
  endDate: string;
}

interface IProps {
  podcastId: string;
  featured: boolean;
  handleOpen: (value: keyof IOpen) => void;
}

const FeaturedPodcast: FC<IProps> = ({ podcastId, featured, handleOpen }) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleDisabled = (value: boolean) => setIsDisabled(value);

  const handleValidate = (values: ISchedule) => {
    const errors: { [key: string]: string } = {};

    if (new Date(values.endDate) <= new Date(values.startDate)) {
      errors.endDate = 'Start date must be below end date';
    }

    return errors;
  };

  const onScheduleFeature = (values: ISchedule) => {
    handleDisabled(true);
    setFeaturedPodcast(
      podcastId,
      featured,
      moment(values.startDate).unix(),
      moment(values.endDate).unix(),
      handleOpen,
      handleDisabled,
    );
  };

  return (
    <FormikWrapper
      initialValues={{
        startDate: '',
        endDate: '',
      }}
      validationSchema={featuredPodcastSchema}
      button={{
        className: 'm-15 w-50 m-auto',
        children: isDisabled ? <Loader /> : 'Schedule Feature',
        isDisabled,
      }}
      onSubmit={onScheduleFeature}
      validate={handleValidate}
    >
      <div className='row featured-podcast'>
        <div className='col-lg-6'>
          <div className='calendar-container'>
            <FormikFieldWrapper
              label='Start Date*'
              name='startDate'
              type='date'
              elementRender={<CalenderElement iconType='date-picker-icon' />}
              min={convertDateTimeFromUnix(moment().unix(), 'YYYY-MM-DD')}
            />
          </div>
        </div>
        <div className='col-lg-6'>
          <div className='calendar-container'>
            <FormikFieldWrapper
              label='End Date*'
              name='endDate'
              type='date'
              elementRender={<CalenderElement iconType='date-picker-icon' />}
              min={convertDateTimeFromUnix(moment().unix(), 'YYYY-MM-DD')}
            />
          </div>
        </div>
      </div>
    </FormikWrapper>
  );
};

export default FeaturedPodcast;
