import { get } from '../utils';
import { PODCAST_ANALYTICS_API_ROUTES as PODCAST_ANALYTICS } from '../../constant/apiRoute';
import {
  IPodcastAnalytic,
  IPodcastAnalyticsChart,
} from '../../types/podcaster';
import AxiosClient from '../AxiosClient';
import { showToastMessage } from '../../utils';
import { TOASTER_STATUS } from '../../constant';

export const getViewDownloadsSubscribeCount = async (
  handleCount: (value: IPodcastAnalytic) => void,
  handleLoading: (value: boolean) => void,
  id: string = '',
) => get(
  `${PODCAST_ANALYTICS.VIEW_DOWNLOADS_SUBSCRIBE_COUNT}?podcastUuid=${id}`,
  handleCount,
  handleLoading,
);

export const getViewDownloadAndSubscribeChartData = async (
  handleChartData: (value: [IPodcastAnalyticsChart]) => void,
  handleLoading: (value: boolean) => void,
  startDate: number,
  endDate: number,
  analyticsEnum: string,
  podcastUuid: string = '',
) => get(
  `${PODCAST_ANALYTICS.VIEW_DOWNLOADS_SUBSCRIBE_CHART}?startDate=${startDate}&endDate=${endDate}&analyticsEnum=${analyticsEnum}&podcastUuid=${podcastUuid}`,
  handleChartData,
  handleLoading,
);

export const getViewDownloadAndSubscribeDataDownload = async (
  startDate: number,
  endDate: number,
  timeZone: string,
  analyticsEnum: string,
  podcastUuid: string = '',
) => {
  try {
    const response: any = await AxiosClient(
      `${PODCAST_ANALYTICS.VIEW_DOWNLOADS_SUBSCRIBE_DOWNLOAD_EXCEL}?startDate=${startDate}&endDate=${endDate}&timeZone=${timeZone}&analyticsEnum=${analyticsEnum}&podcastUuid=${podcastUuid}`,
      {
        responseType: 'blob', // Set responseType to 'blob'
      },
    );
    // Check if response.data is a Blob
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Create a link element
    const downloadLink = document.createElement('a');

    // Create an object URL for the blob
    const objectUrl = URL.createObjectURL(blob);

    // Set the link's href to the object URL
    downloadLink.href = objectUrl;

    // Specify the file name
    downloadLink.setAttribute(
      'download',
      `${analyticsEnum}${startDate}${endDate}.xlsx`,
    );

    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(objectUrl);
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      `'Error downloading audio:'  ${error.message || 'Something went wrong!'}`,
    );
  }
};

export const getPodcastTransactionHistoryData = async (
  handlTransactionHistory: (value: any) => void,
  handleLoading: (value: boolean) => void,
  startDate: number | string,
  endDate: number | string,
  transactionStatus: string = 'all',
  page: number = 1,
  size: number = 10,
) => get(
  `${
    PODCAST_ANALYTICS.TRANSACTION_HISTORY
  }?startDate=${startDate}&endDate=${endDate}&transactionStatus=${transactionStatus}&page=${
    page - 1
  }&size=${size}`,
  handlTransactionHistory,
  handleLoading,
);

export const getRevenuAnalyticsChartData = async (
  handleChartData: (value: [IPodcastAnalyticsChart]) => void,
  handleLoading: (value: boolean) => void,
  startDate: number,
  endDate: number,
) => get(
  `${PODCAST_ANALYTICS.REVENUE_ANALYSIS}?startDate=${startDate}&endDate=${endDate}`,
  handleChartData,
  handleLoading,
);

export const getRevenueCountCount = async (
  handleCount: (value: number) => void,
  handleLoading: (value: boolean) => void,
  id: string = '',
) => get(`${PODCAST_ANALYTICS.REVENUE_COUNT}`, handleCount, handleLoading);

export const getRevenueDataDownload = async (
  startDate: number,
  endDate: number,
  timeZone: string,
) => {
  try {
    const response: any = await AxiosClient(
      `${PODCAST_ANALYTICS.REVENUE_DOWNLOAD_EXCEL}?startDate=${startDate}&endDate=${endDate}&timeZone=${timeZone}`,
      {
        responseType: 'blob', // Set responseType to 'blob'
      },
    );
    // Check if response.data is a Blob
    const blob = new Blob([response?.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Create a link element
    const downloadLink = document.createElement('a');

    // Create an object URL for the blob
    const objectUrl = URL.createObjectURL(blob);

    // Set the link's href to the object URL
    downloadLink.href = objectUrl;

    // Specify the file name
    downloadLink.setAttribute('download', `Revenue${startDate}${endDate}.xlsx`);

    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(objectUrl);
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      `'Error downloading audio:'  ${error?.message || 'Something went wrong!'}`,
    );
  }
};
