import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

import { connect } from 'react-redux';
import ModalWrapper from '../form/ModalWrapper';
import FullPageLoader from '../Loader/FullPageLoader';

import { STRIPE_KEY } from '../../clientConfig';
import CheckoutForm from './CheckoutForm';
import {
  ActivePlanUuidAndEndDate,
  IActivePlanUuidAndEndDate,
  IPaymentStatus,
  IStripe,
  IStripeSecret,
  ISubscriptionPlan,
} from '../../types';
import { PAYMENT_SUCCESS, PAYMENT_FAIL } from '../../constant/modal';

import './index.scss';
import { camelCaseToTitleCase, getHost } from '../../utils';
import { updateUserDetailAction } from '../../redux/actions/user';

interface IProps {
  plan: any | ISubscriptionPlan;
  stripeSecret: IStripeSecret;
  redirectUrl: string;
  updateUserDetailAction: (data: ActivePlanUuidAndEndDate) => Promise<void>;
  paymentIntentClientSecret?: any;
}

const Payment: React.FC<IProps> = ({
  plan,
  stripeSecret,
  redirectUrl,
  updateUserDetailAction,
  paymentIntentClientSecret,
}) => {
  const stripePromise = loadStripe(STRIPE_KEY ?? '');
  const navigate = useNavigate();
  const [stripe, setStripe] = useState<IStripe>({
    isLoading: false,
    stripePromise: null,
  });
  const [paymentStatus, setPaymentStatus] = useState<IPaymentStatus>({
    isSuccess: false,
    isFail: false,
  });
  const [activePlan, setActivePlan] = useState<IActivePlanUuidAndEndDate>({
    activePlanUuid: null,
    activePlanRenewalDate: 0,
    activePlanPeriod: null,
    activePlanAmount: 0,
  });
  const [isLoadingPaymentElement, setIsLoadingPaymentElement] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePaymentLoadingElement = (value: boolean) => setIsLoadingPaymentElement(value);
  const handleLoading = (value: boolean) => setIsLoading(value);
  const redirectOnSuccess = () => navigate(redirectUrl);

  const loadStripePromise = () => {
    stripePromise.then(() => {
      setStripe({
        isLoading: false,
        stripePromise,
      });
      handlePaymentLoadingElement(true);
    });
  };

  useEffect(() => {
    setStripe({
      ...stripe.stripePromise,
      isLoading: true,
    });

    loadStripePromise();
  }, []);

  useEffect(() => {
    handleLoading(false);
  }, [paymentStatus]);

  const updatePaymentStatus = (value: IPaymentStatus) => setPaymentStatus(value);
  const updateActivePlanUuidAndEndDate = (value: IActivePlanUuidAndEndDate) => {
    setActivePlan(value);
  };

  const handleClose = () => updatePaymentStatus({
    isSuccess: false,
    isFail: false,
  });

  useEffect(() => {
    if (paymentStatus.isSuccess) {
      updateUserDetailAction({ activePlanUuidAndEndDate: activePlan });
    }
  }, [paymentStatus, activePlan]);

  const options: any = {
    paymentMethodCreation: 'manual',
    clientSecret: stripeSecret?.setUpIntentClientSecret || paymentIntentClientSecret,
  };

  return (
    <>
      <div className='d-flex make-payment-main payment-container'>
        {isLoading && <FullPageLoader isScreenExist />}
        <div
          className={`selected-plan w-50 w-sm-100 subscription-gap ${
            getHost() === 'listener' ? 'ads-free-plans' : ''
          }`}
        >
          <div className='subscription-block subscription-bg'>
            <div>
              <div className='popular'>POPULAR</div>
              <div className='plan-name'>
                <h1>{plan?.displayName}</h1>
                <p>{plan?.planName}</p>
              </div>
              <div className='price-block'>
                <h2>
                  <sup>$</sup>
                  {' '}
                  {plan?.amount}
                  {!paymentIntentClientSecret && <sup>/ Month</sup>}
                </h2>
                <p>{plan?.caption}</p>
              </div>
              {plan?.planFeatures?.length ? (
                <div className='features'>
                  <p>Starter Features:</p>
                  <ul>
                    {getHost() === 'podcaster'
                      ? plan?.planFeatures.map((feature: any) => (
                        <li key={feature?.featureName}>{feature?.featureName}</li>
                      ))
                      : Object.entries(plan?.features).map(([key, value]) => (
                        <li className={`${!value && 'skip-arrow'}`} key={key}>
                          {camelCaseToTitleCase(key)}
                        </li>
                      ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className='payment-details w-50'>
          <h1>Payment Details</h1>
          {!stripe.isLoading
            && stripe.stripePromise
            && (stripeSecret?.setUpIntentClientSecret || paymentIntentClientSecret) && (
              <Elements stripe={stripe.stripePromise} options={options}>
                <CheckoutForm
                  planUuid={plan.uuid}
                  stripeSecret={stripeSecret}
                  paymentIntentClientSecret={paymentIntentClientSecret}
                  handlePayment={updatePaymentStatus}
                  updateActivePlanUuidAndEndDate={updateActivePlanUuidAndEndDate}
                  isLoadingPaymentElement={isLoadingPaymentElement}
                  handlePaymentLoadingElement={handlePaymentLoadingElement}
                  handleLoading={handleLoading}
                  checkoutAmount={{
                    amount: plan.amount,
                  }}
                  redirectOnSuccess={redirectOnSuccess}
                />
              </Elements>
          )}
        </div>
      </div>

      <ModalWrapper
        show={paymentStatus.isSuccess}
        size='lg'
        body={PAYMENT_SUCCESS.BODY}
        button1={{
          children: PAYMENT_SUCCESS.BUTTON_CHILDREN,
          onClick: () => {},
        }}
        handleClose={handleClose}
      />

      <ModalWrapper
        show={paymentStatus.isFail}
        size='lg'
        body={PAYMENT_FAIL.BODY}
        button1={{
          children: PAYMENT_FAIL.BUTTON1_CHILDREN,
          onClick: () => {},
        }}
        button2={{
          children: PAYMENT_FAIL.BUTTON2_CHILDREN,
          onClick: handleClose,
        }}
        handleClose={handleClose}
      />
    </>
  );
};

const mapDispatchToProps = {
  updateUserDetailAction,
};

export default connect(null, mapDispatchToProps)(Payment);
