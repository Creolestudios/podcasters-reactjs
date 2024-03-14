import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';

import './analytic-card.scss';
import { useLocation } from 'react-router-dom';
import { IPodcastAnalyticsChart, chartDate } from '../../types/podcaster';
import {
  getViewDownloadAndSubscribeChartData,
  getViewDownloadAndSubscribeDataDownload,
} from '../../services/podcaster/Analytics';
import BarChart from '../Chart/BarChart';
import LineChart from '../Chart/LineChart';
import { getUserTimeZone } from '../../utils';

Chart.register(...registerables);

export interface IAnalyticItem {
  title: string;
  value: string | number;
}

interface IProps {
  items: IAnalyticItem[];
}

const AnalyticCard: React.FC<IProps> = ({ items }) => {
  const location = useLocation();
  const userTimeZone = getUserTimeZone();
  const [viewChartDate, setViewChartDate] = useState<chartDate>({ startDate: 0, endDate: 0 });
  const [downloadChartDate, setDownloadChartDate] = useState<chartDate>({
    startDate: 0,
    endDate: 0,
  });
  const [subscriptionChartDate, setSubscriptionChartDate] = useState<chartDate>({
    startDate: 0,
    endDate: 0,
  });

  const [viewChartData, setViewChartData] = useState<[IPodcastAnalyticsChart] | []>([]);
  const [downloadChartData, setDownloadChartData] = useState<[IPodcastAnalyticsChart] | []>([]);
  const [subscribeChartData, setSubscribeChartData] = useState<[IPodcastAnalyticsChart] | []>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleViewChartData = (chartData: [IPodcastAnalyticsChart]) => {
    setViewChartData(chartData);
  };
  const handleDownloadChartData = (chartData: [IPodcastAnalyticsChart]) => {
    setDownloadChartData(chartData);
  };
  const handleSubscribeChartData = (chartData: [IPodcastAnalyticsChart]) => {
    setSubscribeChartData(chartData);
  };

  const handleLoading = (value: boolean) => setIsLoading(value);

  useEffect(() => {
    if (viewChartDate?.startDate && viewChartDate?.endDate) {
      getViewDownloadAndSubscribeChartData(
        handleViewChartData,
        handleLoading,
        viewChartDate.startDate,
        viewChartDate.endDate,
        'VIEW',
        location?.state?.podcastId,
      );
    }
  }, [viewChartDate]);

  useEffect(() => {
    if (downloadChartDate?.startDate && downloadChartDate?.endDate) {
      getViewDownloadAndSubscribeChartData(
        handleDownloadChartData,
        handleLoading,
        downloadChartDate.startDate,
        downloadChartDate.endDate,
        'DOWNLOAD',
        location?.state?.podcastId,
      );
    }
  }, [downloadChartDate]);

  useEffect(() => {
    if (subscriptionChartDate?.startDate && subscriptionChartDate?.endDate) {
      getViewDownloadAndSubscribeChartData(
        handleSubscribeChartData,
        handleLoading,
        subscriptionChartDate.startDate,
        subscriptionChartDate.endDate,
        'SUBSCRIBE',
        location?.state?.podcastId,
      );
    }
  }, [subscriptionChartDate]);

  const getSelectedRange = (selectedRange: chartDate) => {
    if (Object.keys(selectedRange)[0] === 'Views') {
      setViewChartDate(Object.values(selectedRange)[0]);
    } else if (Object.keys(selectedRange)[0] === 'Downloads') {
      setDownloadChartDate(Object.values(selectedRange)[0]);
    } else if (Object.keys(selectedRange)[0] === 'Subscribers') {
      setSubscriptionChartDate(Object.values(selectedRange)[0]);
    }
  };

  const downloadChart = (title: string) => {
    if (title === 'Views') {
      getViewDownloadAndSubscribeDataDownload(
        viewChartDate.startDate,
        viewChartDate.endDate,
        userTimeZone,
        'VIEW',
        location?.state?.podcastId,
      );
    } else if (title === 'Downloads') {
      getViewDownloadAndSubscribeDataDownload(
        downloadChartDate.startDate,
        downloadChartDate.endDate,
        userTimeZone,
        'DOWNLOAD',
        location?.state?.podcastId,
      );
    } else if (title === 'Subscribers') {
      getViewDownloadAndSubscribeDataDownload(
        subscriptionChartDate.startDate,
        subscriptionChartDate.endDate,
        userTimeZone,
        'SUBSCRIBE',
        location?.state?.podcastId,
      );
    }
  };

  return (
    <div className='analytic-card'>
      {items?.length > 0
        && items.map((item: IAnalyticItem) => (
          <div>
            <div className='digit-box'>
              <p className='mb-0'>{item.title}</p>
              <h1 className='d-flex  align-items-center'>{item.value}</h1>
            </div>
            <div className='m-t-24'>
              {item.title === 'Views' && (
                <div className='graph'>
                  <LineChart
                    title='Views'
                    getSelectedRange={getSelectedRange}
                    lineChartData={viewChartData}
                    downloadChart={(title: string) => {
                      downloadChart(title);
                    }}
                  />
                </div>
              )}

              {item.title === 'Downloads' && (
                <div className='graph'>
                  <BarChart
                    title='Downloads'
                    getSelectedRange={getSelectedRange}
                    chartData={downloadChartData}
                    downloadChart={(title: string) => {
                      downloadChart(title);
                    }}
                  />
                </div>
              )}
              {item.title === 'Subscribers' && (
                <div className='graph'>
                  <BarChart
                    title='Subscribers'
                    getSelectedRange={getSelectedRange}
                    chartData={subscribeChartData}
                    downloadChart={(title: string) => {
                      downloadChart(title);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnalyticCard;
