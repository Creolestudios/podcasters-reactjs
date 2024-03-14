import React from 'react';
import { useLocation } from 'react-router-dom';

import Payment from '../../../components/Payment';
import { PODCASTER_APP_ROUTES as PODCSTER } from '../../../constant/appRoute';

import '../../../assets/scss/podcaster-payment-screen.scss';

const PaymentScreen = () => {
  const { state } = useLocation();

  return (
    <div className='payment-screen-container'>
      {state && Object.keys(state).length > 0 && (
        <Payment
          plan={state.plan}
          stripeSecret={state.stripeSecret}
          redirectUrl={PODCSTER.ROOT}
          paymentIntentClientSecret={state.paymentIntentClientSecret}
        />
      )}
    </div>
  );
};

export default PaymentScreen;
