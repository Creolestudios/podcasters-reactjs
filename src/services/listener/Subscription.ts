import { TOASTER_STATUS } from '../../constant';
import { LISTENER_SUBSCRIPTION_API_ROUTES as LISTENER } from '../../constant/apiRoute';
import { IListenerSubscription } from '../../types';
import { showToastMessage } from '../../utils';
import AxiosClient from '../AxiosClient';

export const getSubscriptionPlansService = async (
  handleSubscriptionPlans: (plans: [IListenerSubscription]) => void,
  handleLoading: (value: boolean) => void,
  role: string,
  period: string,
) => {
  try {
    const response = await AxiosClient(`${LISTENER.SUBSCRIPTION_PLANS}=${role}&period=${period}`);

    if (response?.data?.success) {
      handleSubscriptionPlans(response?.data?.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.developerMessage ?? error?.message,
    );
  } finally {
    handleLoading(false);
  }
};

export const activeTrailPlan = async (
  onSuccess: (
    planUuid: string,
    planEndDate: number,
    planPeriod: string,
    planAmount: number
  ) => void,
  handleLoading: (value: boolean) => void,
  planUuid: string,
) => {
  try {
    const response = await AxiosClient.post(`${LISTENER.ACTIVE_TRAIL_PLAN}/${planUuid}`);

    if (response?.data?.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, 'Free Plan Activated!');
      onSuccess(
        response?.data?.result?.activePlanUuid,
        response?.data?.result?.activePlanRenewalDate,
        response?.data?.result?.activePlanPeriod,
        response?.data?.result?.activePlanAmount,
      );
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.developerMessage ?? error?.message,
    );
  } finally {
    handleLoading(false);
  }
};

export const cancelPlan = async (
  onSuccess: (
    planUuid: string | null,
    planEndDate: number,
    planPeriod: string | null,
    planAmount: number
  ) => void,
  handleLoading: (value: boolean) => void,
  planUuid: string,
) => {
  try {
    const response = await AxiosClient.post(`${LISTENER.CANCEL_PLAN}/${planUuid}`);

    if (response?.data?.success) {
      onSuccess(null, 0, null, 0);
      showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.developerMessage ?? error?.message,
    );
  } finally {
    handleLoading(false);
  }
};
