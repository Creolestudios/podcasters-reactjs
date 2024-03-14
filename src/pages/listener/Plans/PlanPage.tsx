import React, { FC, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getSubscriptionPlansService } from '../../../services/listener/Subscription';
import { Subscription } from '../../../components/Subscription/Subscription';
import FullPageLoader from '../../../components/Loader/FullPageLoader';

import { IListenerSubscription, IUser } from '../../../types';
import { IState } from '../../../redux/types';
import { getUser } from '../../../redux/selectors/user';

interface IProps {
  user: IUser;
}

const PlanPage: FC<IProps> = ({ user }) => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<Array<IListenerSubscription>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [period, setPeriod] = useState('');

  const handlePeriod = (value: string) => {
    setPeriod(value);
  };

  const handleSubscriptionPlan = (plans: [IListenerSubscription]) => setSubscriptionPlans(plans);
  const handleLoading = (value: boolean) => setIsLoading(value);

  useEffect(() => {
    if (period) {
      handleLoading(true);
      getSubscriptionPlansService(handleSubscriptionPlan, handleLoading, 'LISTENER', period);
    }
  }, [period]);

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
        <FullPageLoader isScreenExist />
      ) : (
        <div>
          {subscriptionPlans.length > 0 ? (
            <Subscription
              subscriptionPlans={subscriptionPlans}
              period={period}
              handlePeriod={handlePeriod}
            />
          ) : (
            <p>No Subscription Plan Found</p>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  user: getUser(state),
});

export default connect(mapStateToProps, null)(PlanPage);
