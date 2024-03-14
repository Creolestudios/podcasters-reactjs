import AxiosClient from '../AxiosClient';
import { invokeWithDelay, showToastMessage } from '../../utils';

import { TOASTER_STATUS } from '../../constant';
import { PODCASTER_SUBSCRIPTION_API_ROUTES as PODCASTER } from '../../constant/apiRoute';
import {
  IActivatePlan,
  ISubscriptionSecret,
  ISubscriptionPlan,
  IAddPaymentToSetupIntent,
  IStripeSecret,
  IPaymentStatus,
  IActivePlanUuidAndEndDate,
} from '../../types';

export const getSubscriptionPlansService = async (
  handleSubscriptionPlans: (plans: [ISubscriptionPlan]) => void,
  handleLoading: (value: boolean) => void,
  role: string,
  period: string,
) => {
  try {
    const response = await AxiosClient.get(
      `${PODCASTER.SUBSCRIPTION_PLANS}=${role}&period=${period}`,
    );

    if (response.data.success) {
      handleSubscriptionPlans(response.data.result);
      handleLoading(false);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  }
};

export const getPlans = async (
  handlePlan: (plans: [ISubscriptionPlan]) => void,
  handleLoading: (value: boolean) => void,
  role: string,
) => {
  try {
    const response = await AxiosClient.get(`${PODCASTER.SUBSCRIPTION_PLANS}=${role}`);

    if (response.data.success) {
      handlePlan(response.data.result);
      handleLoading(false);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  }
};

export const getSetUpIntentService = async (
  plan: ISubscriptionPlan,
  handleLoading: (value: boolean) => void,
  handleSubscriptionSecre: (value: ISubscriptionSecret) => void,
) => {
  try {
    const response = await AxiosClient.post(PODCASTER.SET_UP_INTENT);

    if (response.data.success) {
      handleSubscriptionSecre({
        plan,
        stripeSecret: {
          setUpIntentClientSecret: response.data.result.setUpIntentClientSecret,
          intentId: response.data.result.intentId,
        },
      });
      handleLoading(false);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  }
};

const successPayment = (onPayment: (value: IPaymentStatus) => void) => onPayment({
  isSuccess: true,
  isFail: false,
});

const failPayment = (onPayment: (value: IPaymentStatus) => void) => onPayment({
  isSuccess: false,
  isFail: true,
});

const activateSubscriptionPlan = async (
  payload: IActivatePlan,
  handlePayment: (value: IPaymentStatus) => void,
  updateActivePlanUuidAndEndDate: (value: IActivePlanUuidAndEndDate) => void,

  redirectOnSuccess: () => void,
) => {
  try {
    const response = await AxiosClient.post(PODCASTER.ACTIVATE_PLAN, {
      planUuId: payload.planUuid,
      userUuId: payload.userUuid,
      paymentMethodId: payload.paymentMethodId,
      couponCode: payload.couponCode,
    });

    if (response.data.success) {
      updateActivePlanUuidAndEndDate({
        activePlanUuid: response?.data?.result?.activePlanUuid,
        activePlanRenewalDate: response?.data?.result?.activePlanRenewalDate,
        activePlanPeriod: response?.data?.result?.activePlanPeriod,
        activePlanAmount: response?.data?.result?.activePlanAmount,
      });
      successPayment(handlePayment);
      invokeWithDelay(redirectOnSuccess, 500);
    } else {
      failPayment(handlePayment);
    }
  } catch (error: any) {
    failPayment(handlePayment);
  }
};

const confirmPayment = async (
  stripe: any,
  planUuid: string,
  couponCode: string,
  payload: any,
  handlePayment: (value: IPaymentStatus) => void,
  updateActivePlanUuidAndEndDate: (value: IActivePlanUuidAndEndDate) => void,

  redirectOnSuccess: () => void,
) => {
  try {
    const confirm = await stripe.confirmSetup(payload);

    if (confirm && confirm.setupIntent && confirm.setupIntent.id) {
      const userUuid = localStorage.getItem('userUuid');
      const paymentMethodId = confirm.setupIntent.payment_method;

      if (userUuid) {
        activateSubscriptionPlan(
          {
            planUuid,
            userUuid,
            paymentMethodId,
            couponCode,
          },
          handlePayment,
          updateActivePlanUuidAndEndDate,
          redirectOnSuccess,
        );
      }
    } else {
      failPayment(handlePayment);
    }
  } catch (error: any) {
    failPayment(handlePayment);
  }
};

const addPaymentToSetupIntent = async (
  payload: IAddPaymentToSetupIntent,
  stripe: any,
  planUuid: string,
  couponCode: string,
  handlePayment: (value: IPaymentStatus) => void,
  updateActivePlanUuidAndEndDate: (value: IActivePlanUuidAndEndDate) => void,

  redirectOnSuccess: () => void,
) => {
  try {
    const response = await AxiosClient.post(PODCASTER.ADD_PAYMENT_TO_SET_UP_INTENT, payload);

    if (response.data.success) {
      const clientSecret = response.data.result.setUpIntentClientSecret;
      const confirmPaymentPayload: any = {
        clientSecret,
        redirect: 'if_required',
      };

      confirmPayment(
        stripe,
        planUuid,
        couponCode,
        confirmPaymentPayload,
        handlePayment,
        updateActivePlanUuidAndEndDate,
        redirectOnSuccess,
      );
    } else {
      failPayment(handlePayment);
    }
  } catch (error: any) {
    failPayment(handlePayment);
  }
};

const doPayment = async (
  stripe: any,
  payload: any,
  planUuid: string,
  couponCode: string,
  stripeSecret: IStripeSecret,
  handlePayment: (value: IPaymentStatus) => void,
  updateActivePlanUuidAndEndDate: (value: IActivePlanUuidAndEndDate) => void,
  redirectOnSuccess: () => void,
) => {
  try {
    const payment = await stripe.createPaymentMethod(payload);

    if (payment && payment.paymentMethod && payment.paymentMethod.id) {
      addPaymentToSetupIntent(
        {
          ...stripeSecret,
          paymentMethodId: payment.paymentMethod.id,
        },
        stripe,
        planUuid,
        couponCode,
        handlePayment,
        updateActivePlanUuidAndEndDate,
        redirectOnSuccess,
      );
    } else {
      failPayment(handlePayment);
    }
  } catch (error: any) {
    failPayment(handlePayment);
  }
};

export const checkPaymentDataService = async (
  stripe: any,
  elements: any,
  name: string,
  planUuid: string,
  couponCode: string,
  stripeSecret: IStripeSecret,
  handlePayment: (value: IPaymentStatus) => void,
  updateActivePlanUuidAndEndDate: (value: IActivePlanUuidAndEndDate) => void,
  redirectOnSuccess: () => void,
) => {
  try {
    const { error: submitError } = await elements.submit();

    if (submitError) {
      failPayment(handlePayment);
    } else {
      const paymentMethodData: any = {
        elements,
        params: {
          billing_details: {
            name,
          },
        },
      };

      doPayment(
        stripe,
        paymentMethodData,
        planUuid,
        couponCode,
        stripeSecret,
        handlePayment,
        updateActivePlanUuidAndEndDate,
        redirectOnSuccess,
      );
    }
  } catch (error: any) {
    failPayment(handlePayment);
  }
};

export const confirmStripePayment = async (
  stripe: any,
  elements: any,
  handlePayment: (value: IPaymentStatus) => void,
  redirectOnSuccess: CallableFunction,
) => {
  try {
    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (result?.error) {
      failPayment(handlePayment);
    } else {
      successPayment(handlePayment);
      invokeWithDelay(redirectOnSuccess, 500);
    }
  } catch (error) {
    failPayment(handlePayment);
  }
};

export const applyCouponCode = async (
  couponCode: string,
  planUuid: string,
  handleCouponBtnDisabled: (value: boolean) => void,
  handleCouponDetail: (details: any) => void,
) => {
  try {
    const response = await AxiosClient(
      `${PODCASTER.CHECK_COUPON}${couponCode}&planUuid=${planUuid}`,
    );
    if (response?.data?.success) {
      if (response?.data?.result?.valie) {
        handleCouponDetail(response?.data?.result);
        showToastMessage(TOASTER_STATUS.SUCCESS, 'Coupon Applied Successfully');
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, 'Coupon is not applicable');
      }
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage || error?.message,
    );
  } finally {
    handleCouponBtnDisabled(false);
  }
};

export const paymentPlanAction = async (
  planAction: any,
  handleLoading: (value: boolean) => void,
  handlepaymentIntent: (value: any) => void,
) => {
  try {
    const response = await AxiosClient.post(
      `${PODCASTER.PAYMENT_PLAN_ACTION}/${planAction?.actionName}`,
    );
    if (response?.data?.success) {
      handlepaymentIntent({
        plan: planAction,
        paymentIntentClientSecret: response?.data?.result,
      });
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage || error?.message,
    );
  } finally {
    handleLoading(false);
  }
};
