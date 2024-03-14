import React, { FC, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSubscriptionPlansService } from '../../../services/podcaster/Subscription';
import { Subscription } from '../../../components/Subscription/Subscription';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import { getValueLocalStorage } from '../../../utils';

import { ISubscriptionPlan, IUser } from '../../../types';
import { IState } from '../../../redux/types';
import { getUserSubscribedPlanId, getUser } from '../../../redux/selectors/user';
import { PODCASTER_APP_ROUTES } from '../../../constant/appRoute';

interface IProps {
  userSubscribedPlanId: any;
  user: IUser;
}

const SubscriptionScreen: FC<IProps> = ({ userSubscribedPlanId, user }) => {
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const [subscriptionPlans, setSubscriptionPlans] = useState<Array<ISubscriptionPlan>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [period, setPeriod] = useState('');

  const handlePeriod = (value: string) => {
    setPeriod(value);
  };
  const handleSubscriptionPlan = (plans: [ISubscriptionPlan]) => setSubscriptionPlans(plans);
  const handleLoading = (value: boolean) => setIsLoading(value);

  useEffect(() => {
    if (locationState?.isRedirectFromLogin && userSubscribedPlanId) {
      navigate(PODCASTER_APP_ROUTES.ROOT);
    } else {
      handleLoading(true);
      if (period) {
        getSubscriptionPlansService(
          handleSubscriptionPlan,
          handleLoading,
          getValueLocalStorage('host').toUpperCase(),
          period,
        );
      }
    }
  }, [userSubscribedPlanId, period]);
  useEffect(() => {
    if (user?.activePlanUuidAndEndDate?.activePlanPeriod) {
      setPeriod(user?.activePlanUuidAndEndDate?.activePlanPeriod);
    } else {
      setPeriod('MONTHLY');
    }
  }, [user?.activePlanUuidAndEndDate?.activePlanPeriod]);

  return (
    <div>
      {isLoading ? (
        <FullPageLoader />
      ) : (
        <div>
          <Subscription
            subscriptionPlans={subscriptionPlans}
            period={period}
            handlePeriod={handlePeriod}
            user={user}
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  userSubscribedPlanId: getUserSubscribedPlanId(state),
  user: getUser(state),
});

export default connect(mapStateToProps, null)(SubscriptionScreen);
