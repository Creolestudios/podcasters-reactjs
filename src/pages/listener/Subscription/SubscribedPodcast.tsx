import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PodcastItem from '../../../components/Podcast/PodcastItem';
import { getPodcastYouFollow } from '../../../services/listener/Podcast';
import Loader from '../../../components/Loader/Loader';
import { showToastMessage } from '../../../utils';
import { TOASTER_STATUS } from '../../../constant';

interface IProps {
  isActive: boolean;
}
const SubscribedPodcast: React.FC<IProps> = ({ isActive }) => {
  const [subscribedPodcasts, setSubscribedPodcasts] = useState<any>([]);
  const [filterTotal, setFilterTotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [sizeOfData, setSizeOfData] = useState<number>(0);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

  const doGetPodcastYouFollow = async (page: number = 0, size: number = 10) => {
    try {
      const response = await getPodcastYouFollow(page, size);
      if (response?.data?.success) {
        setSubscribedPodcasts(response?.data?.result?.data);
        setFilterTotal(response?.data?.result?.recordsFiltered);
        setTotal(response?.data?.result?.recordsTotal);
        setSizeOfData(size);
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
      }
    } catch (error: any) {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        error?.response?.data?.result?.developerMessage || error?.message || 'Something went wrong!',
      );
    } finally {
      setIsPageLoading(false);
    }
  };

  const fetchMoreData = () => {
    doGetPodcastYouFollow(0, sizeOfData + 10);
  };

  useEffect(() => {
    if (isActive) {
      setIsPageLoading(true);
      doGetPodcastYouFollow();
    }
    return setSubscribedPodcasts([]);
  }, [isActive]);

  return (
    <div>
      {isPageLoading ? (
        <Loader />
      ) : (
        <div id='infinite-scrollbar'>
          <InfiniteScroll
            dataLength={filterTotal}
            next={() => fetchMoreData()}
            hasMore={total > filterTotal}
            loader={<Loader />}
          >
            {subscribedPodcasts?.length ? (
              <div className='search-result'>
                {subscribedPodcasts?.map((podcast: any) => (
                  <PodcastItem podcast={podcast} className='search-item' />
                ))}
              </div>
            ) : (
              <h3>You have not subscribed to any podcast.</h3>
            )}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default SubscribedPodcast;
