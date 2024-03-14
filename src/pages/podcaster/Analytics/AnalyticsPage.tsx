import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../../components/BackButton';
import TabWrapper from '../../../components/TabWrapper.tsx';
import PodcastAnalytics from './PodcastAnalytics';

import '../../../assets/scss/podcaster-analytics.scss';
import { PODCASTER_APP_ROUTES } from '../../../constant/appRoute';
import RevenueAnalytics from './RevenueAnalytics';
import ButtonWrapper from '../../../components/form/ButtonWrapper';

const AnalyticsPage: React.FC = () => {
  const { state: locationState } = useLocation();
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('podcastAnalytics');

  const handlePageLoading = (value: boolean) => setIsPageLoading(value);
  const onBack = () => {
    if (locationState?.podcastId?.length > 0) {
      navigate(locationState?.pathName);
    } else if (locationState?.isFrom === PODCASTER_APP_ROUTES.TRANSACTION_HISTORY) {
      navigate('/podcaster');
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    if (locationState?.isFrom === PODCASTER_APP_ROUTES.TRANSACTION_HISTORY) {
      setActiveTab('revenueAnalytics');
    } else {
      setActiveTab('podcastAnalytics');
    }
  }, []);

  const customElement = () => (
    <div className='view-transcript'>
      <ButtonWrapper
        className='transaction-history-btn'
        onClick={() => {
          navigate(
            `${PODCASTER_APP_ROUTES.ROOT}/${PODCASTER_APP_ROUTES.ANALYTICS}/${PODCASTER_APP_ROUTES.TRANSACTION_HISTORY}`,
            {
              state: { podcastId: locationState?.podcastId, pathName: locationState?.pathName },
            },
          );
        }}
      >
        Transaction History
      </ButtonWrapper>
    </div>
  );
  return (
    <div className='container analytics-page'>
      <div>
        <BackButton
          text={
            locationState?.podcastName ? `Analytics: ${locationState?.podcastName}` : 'Analytics'
          }
          onClick={onBack}
          isShow={activeTab === 'revenueAnalytics'}
          customElement={customElement()}
        />
      </div>
      <div className='row'>
        <div className='col-lg-12'>
          {locationState?.podcastId ? (
            <PodcastAnalytics
              isActive={activeTab === 'podcastAnalytics'}
              handleLoading={handlePageLoading}
              className='individual-podcast-analytics'
              isPageLoading={isPageLoading}
            />
          ) : (
            <TabWrapper
              items={[
                {
                  key: 'podcastAnalytics',
                  title: 'Podcast Analytics',
                  children: (
                    <PodcastAnalytics
                      isActive={activeTab === 'podcastAnalytics'}
                      handleLoading={handlePageLoading}
                      isPageLoading={isPageLoading}
                    />
                  ),
                },
                {
                  key: 'revenueAnalytics',
                  title: 'Revenue Analytics',
                  children: (
                    <RevenueAnalytics
                      isActive={activeTab === 'revenueAnalytics'}
                      handleLoading={handlePageLoading}
                      isPageLoading={isPageLoading}
                    />
                  ),
                },
              ]}
              onSelect={(value: string) => setActiveTab(value)}
              defaultActiveKey={activeTab}
              id='podcasterAnalytics'
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
