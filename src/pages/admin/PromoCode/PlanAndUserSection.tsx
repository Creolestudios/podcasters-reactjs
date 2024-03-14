import React, { useEffect } from 'react';
import { useField } from 'formik';
import FormikMultiSelectWrapper from '../../../components/FormikWrapper/FormikMultiSelectWrapper';
import { ISubscriptionPlan } from '../../../types';

const PlanAndUserSection = ({
  plans,
  users,
}: {
  plans: ISubscriptionPlan[];
  users: any[];
}) => {
  const [planIdsField, planIdsMeta, planIds] = useField({
    name: 'planIds',
  });
  const [userIdsField, userIdsMeta, userIds] = useField({
    name: 'userIds',
  });
  const [applicableToField, applicableToMeta, applicableTo] = useField({
    name: 'applicableTo',
  });

  useEffect(() => {
    if (planIdsField.value?.length && applicableToField.value !== 'PLAN') {
      applicableTo.setValue('PLAN');
      userIds.setValue([]);
    }
  }, [planIdsField.value]);

  useEffect(() => {
    if (userIdsField.value?.length && applicableToField.value !== 'USER') {
      applicableTo.setValue('USER');
      planIds.setValue([]);
    }
  }, [userIdsField.value]);

  return (
    <>
      <FormikMultiSelectWrapper
        name='planIds'
        label='Plans'
        placeholder='Select plan(s)'
        options={plans.map((plan) => ({
          label: plan.planName,
          value: plan.uuid,
        }))}
      />
      <div className='text-center fw-bold'>OR</div>
      <FormikMultiSelectWrapper
        name='userIds'
        label='Users'
        placeholder='Select user(s)'
        options={users.map((user) => ({
          label: user.email,
          value: user.uuid,
        }))}
      />
    </>
  );
};

export default PlanAndUserSection;
