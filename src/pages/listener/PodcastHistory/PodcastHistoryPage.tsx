import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import PodcastItem from '../../../components/Podcast/PodcastItem';
import { getPodcastHistory } from '../../../services/listener/Podcast';
import Loader from '../../../components/Loader/Loader';
import BackButton from '../../../components/BackButton';
import '../../../assets/scss/podcast-history.scss';
import { IPodcastHistory } from '../../../types/listener';

const PodcastHistoryPage = () => {
  const navigate = useNavigate();

  const [podcasts, setPodcasts] = useState<[IPodcastHistory] | []>([]);
  const [filterTotal, setFilterTotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [sizeOfData, setSizeOfData] = useState<number>(0);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const handlePageLoading = (loading: boolean) => {
    setIsPageLoading(loading);
  };

  const handlePodcastDetails = (details: any) => {
    setPodcasts(details?.data);
    setFilterTotal(details?.recordsFiltered);
    setTotal(details?.recordsTotal);
  };

  const handleSizeOfData = (size: number) => {
    setSizeOfData(size);
  };

  const doGetPodcastHistory = (page: number = 0, size: number = 10, searchString: string = '') => {
    getPodcastHistory(
      handlePodcastDetails,
      handleSizeOfData,
      handlePageLoading,
      page,
      size,
      searchString,
    );
  };

  const fetchMoreData = () => {
    doGetPodcastHistory(0, sizeOfData + 10);
  };

  useEffect(() => {
    handlePageLoading(true);
    doGetPodcastHistory();
  }, []);

  return (
    <div>
      {isPageLoading ? (
        <Loader />
      ) : (
        <div className='podcast-history-page podcast-item-list-container'>
          <div className='row'>
            <div className='col-lg-12'>
              <BackButton text='Podcast History' onClick={() => navigate(-1)} />
            </div>
          </div>
          {podcasts?.length ? (
            <div id='infinite-scrollbar'>
              <InfiniteScroll
                dataLength={filterTotal}
                next={() => fetchMoreData()}
                hasMore={total > filterTotal}
                loader={<Loader />}
              >
                <div className='search-result'>
                  {podcasts?.map((podcast: any) => (
                    <PodcastItem podcast={podcast} className='search-item' />
                  ))}
                </div>
              </InfiniteScroll>
            </div>
          ) : (
            !isPageLoading && <h3>No Data Found</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default PodcastHistoryPage;
