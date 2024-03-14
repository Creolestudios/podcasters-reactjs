import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AnalyticCard, { IAnalyticItem } from '../../../components/CardWrapper/AnalyticCard';
import { getViewDownloadsSubscribeCount } from '../../../services/podcaster/Analytics';
import { IPodcastAnalytic } from '../../../types/podcaster';
import { getCountWithSuffix } from '../../../utils';
import Loader from '../../../components/Loader/Loader';

interface IProps {
  handleLoading: (value: boolean) => void;
  isActive: boolean;
  className?: string;
  isPageLoading?: boolean;
}

const PodcastAnalytics: React.FC<IProps> = ({
  handleLoading,
  isActive,
  className,
  isPageLoading,
}) => {
  const { state: locationState } = useLocation();
  const [count, setCount] = useState<IPodcastAnalytic>({
    subscriptionCount: 0,
    viewCount: 0,
    downloadCount: 0,
  });

  const handleCount = (value: IPodcastAnalytic) => setCount(value);

  useEffect(() => {
    if (isActive) {
      handleLoading(true);
      getViewDownloadsSubscribeCount(handleCount, handleLoading, locationState?.podcastId ?? '');
    }
  }, [isActive]);

  const anyalyticsItems: IAnalyticItem[] = [
    { title: 'Views', value: getCountWithSuffix(count?.viewCount || 0, 'K') },
    { title: 'Downloads', value: getCountWithSuffix(count?.downloadCount || 0, 'K') },
    { title: 'Subscribers', value: getCountWithSuffix(count?.subscriptionCount || 0, 'K') },
  ];

  return (
    <div className={className}>
      {isPageLoading ? <Loader /> : <AnalyticCard items={anyalyticsItems} />}
    </div>
  );
};

export default PodcastAnalytics;
