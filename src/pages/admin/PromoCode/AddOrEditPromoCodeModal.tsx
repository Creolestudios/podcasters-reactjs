import React, { useEffect, useState } from 'react';
import moment from 'moment';
import ModalWrapper from '../../../components/form/ModalWrapper';
import FormikWrapper from '../../../components/FormikWrapper';
import Loader from '../../../components/Loader/Loader';
import FormikFieldWrapper from '../../../components/FormikWrapper/FormikFieldWrapper';
import { IPromoCode } from '../../../types/admin';
import { addPromoCodeSchema } from '../../../utils/formValidationSchema';
import { getPlans } from '../../../services/podcaster/Subscription';
import { ISubscriptionPlan } from '../../../types';
import { getActivePodcasterDetails } from '../../../services/admin/Podcaster';
import DateAndTimeSection from './DateAndTimeSection';
import { getScheduledDateTime } from '../../../utils';
import { addPromoCode } from '../../../services/admin/PromoCode';
import DiscountAndAmountSection from './DiscountAndAmountSection';
import UsesSection from './UsesSection';
import PlanAndUserSection from './PlanAndUserSection';
import './promocode.scss';

interface AddOrEditPromoCodeModalProps {
  open: boolean;
  close: () => void;
  handleRefetchData: () => void;
}

const initialValuesOfPromoCode = {
  couponName: '',
  couponOffType: 'PERCENTAGE',
  couponEndDate: moment().unix(),
  couponStartDate: moment().unix(),
  coupounUsageType: 'Limited',
  discount: 0,
  maxRedemptions: 0,
  planOrUserIds: [],
  applicableTo: 'PLAN',
  applicableToAll: false,
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  amount: 0,
  planIds: [],
  userIds: [],
};

const AddOrEditPromoCodeModal = ({
  open,
  close,
  handleRefetchData,
}: AddOrEditPromoCodeModalProps) => {
  const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (values: any) => {
    setIsSubmitting(true);
    const {
      amount,
      applicableTo,
      couponName,
      couponOffType,
      coupounUsageType,
      discount,
      endDate,
      endTime,
      maxRedemptions,
      startDate,
      startTime,
      planIds,
      userIds,
    } = values;

    const data: Partial<IPromoCode> = {
      couponName,
      applicableToAll: false,
      couponOffType,
      couponStartDate: getScheduledDateTime(startDate, startTime),
      coupounUsageType: (coupounUsageType as string).toLocaleUpperCase() as
        | 'LIMITED'
        | 'UNLIMITED',

      couponEndDate: getScheduledDateTime(endDate, endTime),
      discount: couponOffType === 'PERCENTAGE' ? discount : amount,
      applicableTo,
      planOrUserIds: applicableTo === 'PLAN' ? planIds : userIds,
      maxRedemptions: coupounUsageType === 'Limited' ? maxRedemptions : null,
    };
    addPromoCode(
      data as IPromoCode,
      () => setIsSubmitting(false),
      () => {
        close();
        handleRefetchData();
      },
    );
  };

  const handlePlans = (plans: ISubscriptionPlan[]) => setPlans(plans);

  const handleUsers = (users: any) => setUsers(users?.data);

  useEffect(() => {
    if (open) {
      getPlans(handlePlans, () => {}, 'PODCASTER');
      getActivePodcasterDetails(handleUsers, () => {});
    }
  }, [open]);

  return (
    <ModalWrapper
      size='lg'
      show={open}
      handleClose={close}
      className='add-promocode-popup'
      body={{
        title: 'Add New Promo',
        content: '',
      }}
      button1={{
        children: '',
        onClick: () => {},
      }}
      customElement={(
        <div className='popup-body-container'>
          <FormikWrapper
            initialValues={initialValuesOfPromoCode}
            validationSchema={addPromoCodeSchema}
            button={{
              className: 'btn-style w-100 mt-1',
              children: isSubmitting ? <Loader /> : 'Create',
            }}
            onSubmit={handleSubmit}
          >
            <div className='fields-container'>
              <FormikFieldWrapper
                label='Promo Code Name'
                name='couponName'
                type='text'
                placeholder='Enter promo code name'
                required
              />
              <DiscountAndAmountSection />
              <UsesSection />
              <DateAndTimeSection
                dateLabel='Start Date'
                timeLabel='Start Time'
                dateField='startDate'
                timeField='startTime'
              />
              <DateAndTimeSection
                dateLabel='End Date'
                timeLabel='End Time'
                dateField='endDate'
                timeField='endTime'
              />
              <PlanAndUserSection plans={plans} users={users} />
            </div>
          </FormikWrapper>
        </div>
      )}
    />
  );
};

export default AddOrEditPromoCodeModal;
