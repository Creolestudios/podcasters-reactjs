import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ButtonWrapper from '../form/ButtonWrapper';

import { ActivePlanUuidAndEndDate, ISubscriptionPlan, IUser } from '../../types';
import { IState } from '../../redux/types';
import { getUser } from '../../redux/selectors/user';
import {
  camelCaseToTitleCase,
  formatDayAndMonth,
  getHost,
  getLocalStorage,
  showToastMessage,
} from '../../utils';
import { activeTrailPlan, cancelPlan } from '../../services/listener/Subscription';
import Loader from '../Loader/Loader';
import { getUserDetailAction, updateUserDetailAction } from '../../redux/actions/user';
import { TOASTER_STATUS } from '../../constant';

interface IProps {
  item: any | ISubscriptionPlan;
  handleClick: (value: ISubscriptionPlan) => void;
  user: IUser;
  updateUserDetailAction: (data: ActivePlanUuidAndEndDate) => Promise<void>;
  period?: string;
  getUserDetailAction: (host: string) => void;
}

const SubscriptionCard: FC<IProps> = ({
  item,
  handleClick,
  user,
  updateUserDetailAction,
  period,
  getUserDetailAction,
}) => {
  const isAuthenticated = getLocalStorage('accessToken');
  const host = getLocalStorage('host');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCancelLoading, setIsCancelLoading] = useState<boolean>(false);

  const handleLoading = (value: boolean) => setIsLoading(value);
  const handleCancelLoading = (value: boolean) => setIsCancelLoading(value);

  const setBackground = () => {
    let className = '';
    if (
      user?.activePlanUuidAndEndDate
      && item?.uuid === user?.activePlanUuidAndEndDate?.activePlanUuid
    ) {
      className = 'subscription-bg selected-user-plan';
    }
    if (item.planName.toLowerCase() === 'pro') {
      className = 'premium-bg';
    }
    return className;
  };

  const onSuccess = (
    planUuid: string | null,
    planEndDate: number,
    planPeriod: string | null,
    planAmount: number,
  ) => {
    updateUserDetailAction({
      activePlanUuidAndEndDate: {
        activePlanUuid: planUuid,
        activePlanRenewalDate: planEndDate,
        activePlanPeriod: planPeriod,
        activePlanAmount: planAmount,
      },
    });
    getUserDetailAction(host);
  };

  const doActiveTrailPlan = async (planUuid: string) => {
    handleLoading(true);
    await activeTrailPlan(onSuccess, handleLoading, planUuid);
  };

  const doCancelPlan = async (planUuid: string) => {
    handleCancelLoading(true);
    await cancelPlan(onSuccess, handleCancelLoading, planUuid);
  };

  const renderButton = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (
      user?.activePlanUuidAndEndDate
      && item?.uuid === user?.activePlanUuidAndEndDate?.activePlanUuid
    ) {
      return `Next Renew on ${formatDayAndMonth(
        user?.activePlanUuidAndEndDate?.activePlanRenewalDate || 0,
      )}`;
    }
    if (
      user?.activePlanUuidAndEndDate
      && item?.amount >= user?.activePlanUuidAndEndDate?.activePlanAmount
    ) {
      return 'Upgrade Plan';
    }
    if (
      user?.activePlanUuidAndEndDate
      && item?.amount <= user?.activePlanUuidAndEndDate?.activePlanAmount
    ) {
      return 'Downgrade Plan';
    }
    return `Get ${item?.planName}`;
  };

  return (
    <div className='col-xl-4 col-md-6' key={item.uuid}>
      <div className={`subscription-block ${setBackground()}`}>
        <div>
          {item?.popularPlan && <div className='popular'>POPULAR</div>}
          <div className='plan-name'>
            <h1>{item?.planName}</h1>
          </div>

          <div className='price-block'>
            <h2>
              <sup>$</sup>
              {' '}
              {item?.amount}
              <sup>{`/ ${period === 'MONTHLY' ? 'Month' : 'Year'}`}</sup>
            </h2>
            <p>{item?.caption}</p>
          </div>

          <div className='features'>
            <p>Starter Features:</p>
            <ul>
              {getHost() === 'podcaster'
                ? item?.planFeatures.map((feature: any) => (
                  <li key={feature?.featureName}>{feature?.featureName}</li>
                ))
                : Object.entries(item?.features).map(([key, value]) => (
                  <li className={`${!value && 'skip-arrow'}`} key={key}>
                    {camelCaseToTitleCase(key)}
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div>
          {(user?.activePlanUuidAndEndDate?.activePlanUuid && item?.amount > 0)
          || !user?.activePlanUuidAndEndDate ? (
            <ButtonWrapper
              type='button'
              className={`w-100 btn-bg ${
                item?.uuid === user?.activePlanUuidAndEndDate?.activePlanUuid ? 'renew-btn' : ''
              } `}
              onClick={() => {
                if (isAuthenticated) {
                  if (!item?.amount) {
                    doActiveTrailPlan(item?.uuid);
                  } else if (item?.uuid !== user?.activePlanUuidAndEndDate?.activePlanUuid) {
                    handleClick(item);
                  }
                } else {
                  showToastMessage(
                    TOASTER_STATUS.ERROR,
                    <>
                      <span className='m-r-10'>Login Required! </span>
                      <Link to='/login'>login</Link>
                    </>,
                  );
                }
              }}
              isDisabled={item?.uuid === user?.activePlanUuidAndEndDate?.activePlanUuid}
            >
              {renderButton()}
            </ButtonWrapper>
            ) : null}
          {item?.uuid === user?.activePlanUuidAndEndDate?.activePlanUuid && item?.amount ? (
            <ButtonWrapper
              type='button'
              className='w-100 btn-bg reject-btn rebtn'
              onClick={() => doCancelPlan(item?.uuid)}
              isDisabled={isCancelLoading}
            >
              {isCancelLoading ? <Loader /> : 'Cancel'}
            </ButtonWrapper>
          ) : null}
        </div>
      </div>
    </div>
  );
};

SubscriptionCard.defaultProps = {
  period: '',
};

const mapStateToProps = (state: IState) => ({
  user: getUser(state),
});

const mapDispatchToProps = {
  updateUserDetailAction,
  getUserDetailAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionCard);
