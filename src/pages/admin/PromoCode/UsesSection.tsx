import React, { useEffect } from 'react';
import { useField } from 'formik';
import FormikFieldWrapper from '../../../components/FormikWrapper/FormikFieldWrapper';
import FormikSelectWrapper from '../../../components/FormikWrapper/FormikSelectWrapper';

const UsesSection = () => {
  const [coupounUsageTypeField, coupounUsageTypeMeta, coupounUsageType] = useField({
    name: 'coupounUsageType',
  });
  const [maxRedemptionsField, maxRedemptionsMeta, maxRedemptions] = useField({
    name: 'maxRedemptions',
  });

  useEffect(() => {
    if (coupounUsageTypeField.value === 'Unlimited') {
      maxRedemptions.setValue('');
    }
  }, [coupounUsageTypeField.value]);

  return (
    <div className='row'>
      <div className='col-lg-8'>
        <FormikSelectWrapper
          name='coupounUsageType'
          label='Uses'
          className='text-capitalize'
          options={['Limited', 'Unlimited']}
          selectsuggestion='Select Uses'
          required
        />
      </div>
      <div className='col-lg-4'>
        <FormikFieldWrapper
          label='Uses Limit'
          name='maxRedemptions'
          type='number'
          placeholder='Enter no.'
          disabled={coupounUsageTypeField.value === 'Unlimited'}
          required={coupounUsageTypeField.value === 'Limited'}
        />
      </div>
    </div>
  );
};

export default UsesSection;
