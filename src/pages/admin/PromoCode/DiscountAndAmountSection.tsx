import React, { useEffect } from 'react';
import { useField } from 'formik';
import FormikFieldWrapper from '../../../components/FormikWrapper/FormikFieldWrapper';

const DiscountAndAmountSection = () => {
  const [couponOffTypeField, couponOffTypeMeta, couponOffType] = useField({
    name: 'couponOffType',
  });
  const [discountField, discountMeta, discount] = useField({
    name: 'discount',
  });
  const [amountField, amountMeta, amount] = useField({
    name: 'amount',
  });

  useEffect(() => {
    if (amountField.value !== '') {
      discount.setValue('');
      couponOffType.setValue('FLAT');
    }
  }, [amountField.value]);

  useEffect(() => {
    if (discountField.value !== '') {
      amount.setValue('');
      couponOffType.setValue('PERCENTAGE');
    }
  }, [discountField.value]);

  return (
    <div className='row d-flex align-items-center'>
      <div className='col-lg-5'>
        <FormikFieldWrapper
          label='Discount (%)'
          name='discount'
          type='number'
          placeholder='Enter no.'
          min={0}
        />
      </div>
      <div className='col-lg-2 text-center fw-bold'>OR</div>
      <div className='col-lg-5'>
        <FormikFieldWrapper
          label='Amount ($)'
          name='amount'
          type='number'
          placeholder='Enter amount'
        />
      </div>
    </div>
  );
};

export default DiscountAndAmountSection;
