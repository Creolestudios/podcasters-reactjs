import React, { FC, useEffect, useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import FormikWrapper from '../FormikWrapper';
import FormikFieldWrapper from '../FormikWrapper/FormikFieldWrapper';
import {
  applyCouponCode,
  confirmStripePayment,
  checkPaymentDataService,
} from '../../services/podcaster/Subscription';
import Loader from '../Loader/Loader';

import { checkoutFormSchema } from '../../utils/formValidationSchema';
import { IActivePlanUuidAndEndDate, IPaymentStatus, IStripeSecret } from '../../types';

import './checkout-form.scss';
import ButtonWrapper from '../form/ButtonWrapper';
import SvgIcons from '../../assets/svg/SvgIcons';

interface ICheckoutAmount {
  amount: number;
}

interface IProps {
  planUuid: string;
  stripeSecret: IStripeSecret;
  handlePayment: (value: IPaymentStatus) => void;
  isLoadingPaymentElement: boolean;
  handlePaymentLoadingElement: (value: boolean) => void;
  handleLoading: (value: boolean) => void;
  checkoutAmount: ICheckoutAmount;
  redirectOnSuccess: () => void;
  updateActivePlanUuidAndEndDate: (value: IActivePlanUuidAndEndDate) => void;
  paymentIntentClientSecret?: any;
}

const CheckoutForm: FC<IProps> = ({
  planUuid,
  stripeSecret,
  handlePayment,
  isLoadingPaymentElement,
  handlePaymentLoadingElement,
  handleLoading,
  checkoutAmount,
  redirectOnSuccess,
  updateActivePlanUuidAndEndDate,
  paymentIntentClientSecret,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isPayDisabled, setIsPayDisabled] = useState<boolean>(true);
  const initialValues = {
    name: '',
  };
  const [totalAmount, setTotalAmount] = useState<number>(checkoutAmount.amount);
  const [isCouponBtnDisabled, setIsCouponBtnDisabled] = useState<boolean>(false);
  const [couponDetails, setCouponDetails] = useState<any>(null);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountedAmount, setDiscountedAmount] = useState<number>(0);
  const handleCouponBtnDisabled = (value: boolean) => setIsCouponBtnDisabled(value);
  const handleCouponDetails = (details: any) => setCouponDetails(details);
  const onChangePaymentElement = (evt: StripePaymentElementChangeEvent) => {
    if (evt.complete) {
      setIsPayDisabled(false);
    } else {
      setIsPayDisabled(true);
    }
  };

  useEffect(() => {
    if (couponDetails) {
      if (couponDetails?.couponOffType === 'PERCENTAGE') {
        const discount = ((checkoutAmount?.amount || 0) * (couponDetails?.discount || 0)) / 100;
        setDiscountedAmount(discount);
        setTotalAmount(checkoutAmount?.amount || 0 - discount);
      } else {
        setDiscountedAmount(couponDetails?.discount);
        setTotalAmount((checkoutAmount?.amount || 0) - (couponDetails?.discount || 0));
      }
    }
  }, [couponDetails]);

  const handlePay = (values: any) => {
    if (!stripe || !elements) {
      return;
    }

    handleLoading(true);
    if (paymentIntentClientSecret) {
      confirmStripePayment(stripe, elements, handlePayment, redirectOnSuccess);
    } else {
      checkPaymentDataService(
        stripe,
        elements,
        values.name,
        planUuid,
        couponCode,
        stripeSecret,
        handlePayment,
        updateActivePlanUuidAndEndDate,
        redirectOnSuccess,
      );
    }
  };

  return (
    <div className='checkout-form-container'>
      <div className={isLoadingPaymentElement ? 'hide' : 'show'}>
        <FormikWrapper
          initialValues={initialValues}
          validationSchema={checkoutFormSchema}
          button={{
            className: 'btn-style w-100 mt-50',
            children: `Pay $${totalAmount}`,
            isDisabled: isPayDisabled,
          }}
          onSubmit={handlePay}
        >
          <FormikFieldWrapper
            label='Cardholder Name'
            name='name'
            type='text'
            placeholder='Enter Cardholder Name'
          />
          <PaymentElement
            onReady={() => handlePaymentLoadingElement(false)}
            className='payment-element-container'
            onChange={onChangePaymentElement}
          />
          {!paymentIntentClientSecret && (
            <>
              <div className='coupon-code-section'>
                <hr />
                <div className='coupon-icon'>
                  <SvgIcons iconType='coupon-code-icon' />
                </div>
                <FormikFieldWrapper
                  label='Coupon Code'
                  name='couponCode'
                  type='text'
                  placeholder='Enter Code'
                  handleChange={(value) => {
                    setCouponCode(value);
                  }}
                />
                <ButtonWrapper
                  onClick={() => {
                    handleCouponBtnDisabled(true);
                    applyCouponCode(
                      couponCode,
                      planUuid,
                      handleCouponBtnDisabled,
                      handleCouponDetails,
                    );
                  }}
                  isDisabled={!couponCode?.length || isCouponBtnDisabled}
                  className='btn-primary'
                >
                  {isCouponBtnDisabled ? <Loader /> : 'Apply'}
                </ButtonWrapper>
                <hr />
              </div>
              <div className='payment-summary'>
                <div className='amount-info'>
                  <span className='information'>Amount</span>
                  <span className='amount'>
                    $
                    {checkoutAmount.amount}
                  </span>
                </div>
                <div className='amount-info'>
                  <span className='information'>Coupon discount</span>
                  <span className='amount'>
                    -$
                    {discountedAmount}
                  </span>
                </div>
                <hr />
                <div className='amount-info'>
                  <span className='information'>Total Amount</span>
                  <span className='amount'>
                    $
                    {totalAmount}
                  </span>
                </div>
              </div>
            </>
          )}
        </FormikWrapper>
      </div>
      {isLoadingPaymentElement && <Loader className='payment-element-loader' />}
    </div>
  );
};

export default CheckoutForm;
