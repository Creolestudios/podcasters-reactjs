import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubscriptionCard from './SubscriptionCard';
import { getSetUpIntentService } from '../../services/podcaster/Subscription';
import FullPageLoader from '../Loader/FullPageLoader';

import APP_ROUTES, { PODCASTER_APP_ROUTES as PODCASTER } from '../../constant/appRoute';
import { ISubscriptionPlan, ISubscriptionSecret, IUser } from '../../types';
import BackButton from '../BackButton';
import { getHost } from '../../utils';
import ButtonWrapper from '../form/ButtonWrapper';

interface IProps {
  subscriptionPlans: any;
  period?: string;
  handlePeriod?: (value: string) => void;
  user?: IUser;
}

export const Subscription: React.FC<IProps> = ({
  subscriptionPlans,
  period,
  handlePeriod,
  user,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [subscriptionSecret, setSubscriptionSecret] = useState<ISubscriptionSecret | null>(null);

  useEffect(() => {
    if (subscriptionSecret) {
      if (getHost() === 'listener') {
        navigate('/payment', {
          state: subscriptionSecret,
        });
      } else {
        navigate(`${PODCASTER.ROOT}/${APP_ROUTES.PAYMENT}`, {
          state: subscriptionSecret,
        });
      }
    }
  }, [subscriptionSecret]);

  const handleLoading = (value: boolean) => setIsLoading(value);
  const handleSubscriptionSecret = (value: ISubscriptionSecret) => setSubscriptionSecret(value);
  const handleSelectPlan = (plan: ISubscriptionPlan) => {
    handleLoading(true);
    getSetUpIntentService(plan, handleLoading, handleSubscriptionSecret);
  };

  const customElement = () => (
    <div className='d-flex monthly-yearly my-2 my-md-0'>
      <ButtonWrapper
        className={`m-r-5 ${period === 'MONTHLY' ? 'active' : ''}`}
        onClick={() => {
          if (handlePeriod) handlePeriod('MONTHLY');
        }}
      >
        Monthly
      </ButtonWrapper>
      <ButtonWrapper
        className={`${period === 'YEARLY' ? 'active' : ''}`}
        onClick={() => {
          if (handlePeriod) handlePeriod('YEARLY');
        }}
      >
        Yearly
      </ButtonWrapper>
    </div>
  );

  return (
    <div>
      {isLoading && <FullPageLoader isScreenExist />}
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <BackButton
              text={getHost() === 'podcaster' ? 'My Subscription Plan' : 'Add-Free Plans'}
              onClick={() => {
                if (user?.activePlanUuidAndEndDate?.activePlanUuid) navigate(-1);
              }}
              isShow
              customElement={customElement()}
            />
          </div>
        </div>

        <div
          className={`row subscription-gap ${getHost() !== 'podcaster' ? 'ads-free-plans' : ''}`}
        >
          {subscriptionPlans.length > 0 ? (
            subscriptionPlans.map((plan: ISubscriptionPlan) => (
              <SubscriptionCard
                item={plan}
                handleClick={handleSelectPlan}
                key={plan.uuid}
                period={period}
              />
            ))
          ) : (
            <p>No Subscription Plan Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

Subscription.defaultProps = {
  period: '',
  handlePeriod: () => {},
};
