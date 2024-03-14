import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import BackButton from '../../../components/BackButton';
import { PODCASTER_APP_ROUTES } from '../../../constant/appRoute';
import TabWrapper from '../../../components/TabWrapper.tsx';
import '../../../assets/scss/transaction-history.scss';
import SelectWrapper from '../../../components/Dropdown/SelectWrapper';
import {
  INITIAL_TRNASACTION_DATA,
  podasterTransactionColumns,
} from '../../../constant/table';
import TableWrapper from '../../../components/TableWrapper';
import { getPodcastTransactionHistoryData } from '../../../services/podcaster/Analytics';
import { formatDate, getTimeFromSeconds, updateDates } from '../../../utils';
import { ITransactionHistory, chartDate } from '../../../types/podcaster';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [transactionData, setTransactionData] = useState<[ITransactionHistory]>(
    [INITIAL_TRNASACTION_DATA],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handlePageLoading = (value: boolean) => setIsPageLoading(value);
  const handleLoading = (value: boolean) => setIsLoading(value);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedRange, setSelectedRange] = useState('Monthly');
  const [dateRange, setDateRange] = useState<chartDate>({
    startDate: 0,
    endDate: 0,
  });

  const handlTransactionHistory = (data: any) => {
    setTransactionData(data?.data);
    setTotal(data?.recordsTotal);
  };

  const onBack = () => {
    navigate(`${PODCASTER_APP_ROUTES.ROOT}/${PODCASTER_APP_ROUTES.ANALYTICS}`, {
      state: {
        isFrom: PODCASTER_APP_ROUTES.TRANSACTION_HISTORY,
        podcastId: locationState?.podcastId,
        pathName: locationState?.pathName,
      },
    });
  };

  useEffect(() => {
    if (dateRange?.startDate && dateRange?.endDate) {
      handleLoading(true);
      getPodcastTransactionHistoryData(
        handlTransactionHistory,
        handleLoading,
        dateRange.startDate,
        dateRange.endDate,
        activeTab,
      );
    }
  }, [activeTab]);

  useEffect(() => {
    const dates = updateDates(selectedRange);
    setDateRange(dates);
  }, [selectedRange]);

  useEffect(() => {
    if (dateRange?.startDate && dateRange?.endDate) {
      handleLoading(true);
      getPodcastTransactionHistoryData(
        handlTransactionHistory,
        handleLoading,
        dateRange.startDate,
        dateRange.endDate,
        activeTab,
      );
    }
  }, [dateRange]);

  useEffect(() => {
    handleLoading(true);
    getPodcastTransactionHistoryData(
      handlTransactionHistory,
      handleLoading,
      dateRange.startDate,
      dateRange.endDate,
      activeTab,
      currentPage,
    );
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getTransactions = () => transactionData.map((transaction: any) => ({
    key: transaction.invoiceId,
    Name: `${transaction.firstName} ${transaction.lastName} `,
    Date: formatDate(transaction.transactionDate),
    Time: `At ${getTimeFromSeconds(transaction.transactionDate)}`,
    'Invoice ID': transaction.invoiceId,
    Amount: `$${transaction.amount} USD`,
    Status: transaction.transactionStatus,
  }));

  const customElement = () => (
    <div className='range-selector'>
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
  );

  const transactionTable = () => (
    <TableWrapper
      columns={podasterTransactionColumns}
      data={getTransactions()}
      hasStatus
      hasRatings
      noDataColSpan={7}
      isPagination
      pagination={{
        current: currentPage,
        pageSize: 10,
        total,
        onChange: handlePageChange,
      }}
      hasLoader
      isLoading={isLoading}
    />
  );

  return (
    <div className='container transaction-history'>
      {isPageLoading && <FullPageLoader />}
      <div>
        <BackButton
          text='Transaction History'
          onClick={onBack}
          isShow
          customElement={customElement()}
        />
      </div>
      <div className='row'>
        <div className='col-lg-12'>
          <TabWrapper
            items={[
              {
                key: 'all',
                title: 'All',
                children: transactionTable(),
              },
              {
                key: 'received',
                title: 'Received',
                children: transactionTable(),
              },
              {
                key: 'paid',
                title: 'Paid',
                children: transactionTable(),
              },
            ]}
            onSelect={(value: string) => setActiveTab(value)}
            defaultActiveKey='all'
            id='all'
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
