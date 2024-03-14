import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { formatDate, updateDates } from '../../utils';
import SvgIcons from '../../assets/svg/SvgIcons';
import SelectWrapper from '../Dropdown/SelectWrapper';
import IconButtonWrapper from '../IconButtonWrapper';

interface BarChartProps {
  title: string;
  chartData: any;
  getSelectedRange: any;
  downloadChart?: any;
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  chartData,
  getSelectedRange,
  downloadChart,
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

  const data: any = {
    labels: chartData?.map((count: any) => formatDate(count.date)),
    datasets: [
      {
        lineTension: 0.4,
        pointRadius: 5,
        fill: false,
        backgroundColor: (context: any) => {
          const { ctx } = context.chart;
          const dataValues = context.dataset.data;
          const maxIndex = dataValues.indexOf(Math.max(...dataValues));

          // Create a gradient for each bar
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);

          // Check if the title is 'Downloads' and apply different color stops
          if (title === 'Downloads') {
            // Apply a different color to the bar with the maximum value
            if (context.dataIndex === maxIndex) {
              gradient.addColorStop(0, '#E2F952');
              gradient.addColorStop(0.5, '#E2F95280');
              gradient.addColorStop(1, 'rgba(255, 255, 255, 0.00)');
            } else {
              gradient.addColorStop(0, '#EEEFFF00');
              gradient.addColorStop(0.5, '#EEEFFF80');
              gradient.addColorStop(1, 'rgba(238, 239, 255, 0.00)');
            }
          } else {
            gradient.addColorStop(0, '#E2F952');
            gradient.addColorStop(0.5, '#E2F95280');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.00)');
          }

          return gradient;
        },
        borderColor: title === 'Subscriptions' ? 'transparent' : '#797BA1',
        borderWidth: 1,
        data: chartData?.map((count: any) => count.reportCount),
        barBorderRadius: 10,
      },
    ],
  };

  const options: any = {
    plugins: {
      legend: {
        display: false,
      },
    },
    layout: {
      padding: {
        right: 10,
        left: 5,
        bottom: 15,
      },
    },
    barThickness: title === 'Subscriptions' ? 20 : undefined,
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
                selectedItem={{ label: selectedRange, value: selectedRange }}
              />
            </div>
          </div>
        </div>
      </div>
      <Bar data={data} options={options} height={chartHeight} width={500} />
    </div>
  );
};

BarChart.defaultProps = {
  downloadChart: () => {},
};

export default BarChart;
