import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import SelectWrapper from '../Dropdown/SelectWrapper';
import { formatDate, updateDates } from '../../utils';
import SvgIcons from '../../assets/svg/SvgIcons';
import IconButtonWrapper from '../IconButtonWrapper';

interface IProps {
  title: string;
  lineChartData: any;
  getSelectedRange: any;
  downloadChart?: any;
  width?: number;
}

const LineChart: React.FC<IProps> = ({
  title,
  lineChartData,
  getSelectedRange,
  downloadChart,
  width,
}) => {
  const [selectedRange, setSelectedRange] = useState('');

  useEffect(() => {
    setSelectedRange('Monthly');
  }, []);

  useEffect(() => {
    const dates = updateDates(selectedRange);
    getSelectedRange({ [title]: dates });
  }, [selectedRange]);

  let chartHeight = 400;
  if (window.innerWidth <= 800) {
    chartHeight = 450;
  }
  const data = {
    labels: lineChartData?.map((count: any) => formatDate(count.date)),
    datasets: [
      {
        label: title,
        data: lineChartData?.map((count: any) => count.reportCount),
      },
    ],
  };
  const options: any = {
    responsive: true,
    plugins: {
      legend: false,
    },
    layout: {
      padding: {
        right: 10,
        left: 5,
        bottom: 15,
      },
    },
    tooltips: {
      intersect: false,
      mode: 'index',
      xAlign: 'center',
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          maxTicksLimit: 6,
          callback(n: number) {
            if (n >= 1e3) return `${+(n / 1e3).toFixed(1)}K`;
            return n;
          },
        },
      },
    },
  };

  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      borderColor: '#D0EB25',
      orderColor: '#D0EB25',
      fill: true,
      backgroundColor: (context: any) => {
        const { ctx } = context.chart;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#E2F952');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.00)');
        return gradient;
      },
      borderWidth: 3,
      hoverBackgroundColor: '#D0EB25',
      hoverBorderColor: '#D0EB25',
      pointBackgroundColor: '#D0EB25',
      lineTension: 0.4,
    })),
  };

  return (
    <div className='chart-container'>
      <div className='view-download'>
        <div className='view-download-box'>
          <div className='d-flex align-items-center justify-content-between'>
            <div className='title'>{title}</div>

            <div className='d-flex align-items-center'>
              <IconButtonWrapper
                IconName={SvgIcons}
                iconType='download-icon'
                onClick={() => {
                  downloadChart(title);
                }}
              />
              <SelectWrapper
                items={[
                  { label: 'Weekly', value: 'Weekly' },
                  { label: 'Monthly', value: 'Monthly' },
                  { label: 'Last 60 Days', value: 'Last 60 Days' },
                ]}
                onSelect={(event) => {
                  setSelectedRange(event);
                }}
                selectedItem={{
                  label: selectedRange,
                  value: selectedRange,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Line data={chartData} options={options} height={chartHeight} width={width} />
    </div>
  );
};

LineChart.defaultProps = {
  downloadChart: () => {},
  width: 500,
};

export default LineChart;
