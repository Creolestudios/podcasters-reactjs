import React, { useState, useEffect } from 'react';
import AnalyticCard, { IAnalyticItem } from '../../../components/CardWrapper/AnalyticCard';
import {
  getRevenuAnalyticsChartData,
  getRevenueCountCount,
  getRevenueDataDownload,
} from '../../../services/podcaster/Analytics';
import { IPodcastAnalyticsChart, chartDate } from '../../../types/podcaster';
import { getCountWithSuffix, getUserTimeZone } from '../../../utils';
import LineChart from '../../../components/Chart/LineChart';
import Loader from '../../../components/Loader/Loader';

interface IProps {
  handleLoading: (value: boolean) => void;
  isActive: boolean;
  isPageLoading?: boolean;
}

const RevenueAnalytics: React.FC<IProps> = ({ handleLoading, isActive, isPageLoading }) => {
  const [chartData, setChartData] = useState<[IPodcastAnalyticsChart] | []>([]);
  const [count, setCount] = useState<number>(0);
  const [chartDate, setChartDate] = useState<chartDate>({ startDate: 0, endDate: 0 });
  const userTimeZone = getUserTimeZone();

  const handleCount = (value: number) => setCount(value);

  const getSelectedRange = (selectedRange: chartDate) => {
    setChartDate(Object.values(selectedRange)[0]);
  };
  const handleChartData = (chartData: [IPodcastAnalyticsChart]) => {
    setChartData(chartData);
  };

  const downloadChart = () => {
    getRevenueDataDownload(chartDate.startDate, chartDate.endDate, userTimeZone);
  };

  useEffect(() => {
    if (isActive) {
      if (chartDate?.startDate && chartDate?.endDate) {
        getRevenuAnalyticsChartData(
          handleChartData,
          handleLoading,
          chartDate.startDate,
          chartDate.endDate,
        );
      }
    }
  }, [isActive, chartDate]);

  useEffect(() => {
    if (isActive) {
      handleLoading(true);
      getRevenueCountCount(handleCount, handleLoading);
    }
  }, [isActive]);

  const anyalyticsItems: IAnalyticItem[] = [
    { title: 'Your Estimated Revenue', value: `$${getCountWithSuffix(count, 'K')}` },
  ];

  return (
    <div className='revenu-analytics-tab'>
      {isPageLoading ? (
        <Loader />
      ) : (
        <>
          <AnalyticCard items={anyalyticsItems} />
          <div className='m-t-24'>
            <div className='graph'>
              <LineChart
                title='Your Estimated Revenue'
                getSelectedRange={getSelectedRange}
                width={1200}
                lineChartData={chartData}
                downloadChart={downloadChart}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RevenueAnalytics;
