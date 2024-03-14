import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { getUserTitle, showToastMessage } from '../../../utils';
import { TOASTER_STATUS } from '../../../constant';
import { getSubscribedPodcastandPodcaster } from '../../../services/listener/Podcast';
import { CLOUDINARY_URL } from '../../../clientConfig';
import UserImg from '../../../assets/images/user.png';
import Loader from '../../../components/Loader/Loader';
import { ISubscribedPodcaster } from '../../../types/listener';
import ColorStart from '../../../assets/svg/ColorStart';

interface IProps {
  isActive: boolean;
}

const SubscribedPodcaster: React.FC<IProps> = ({ isActive }) => {
  const navigate = useNavigate();
  const [subscribedPodcasters, setSubscribedPodcasters] = useState<[ISubscribedPodcaster] | []>([]);
  const [filterTotal, setFilterTotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [sizeOfData, setSizeOfData] = useState<number>(0);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

  const doGetSubscribedPodcastandPodcaster = async (page: number = 0, size: number = 15) => {
    try {
      const response = await getSubscribedPodcastandPodcaster(false, page, size);
      if (response?.data?.success) {
        setSubscribedPodcasters(response?.data?.result?.data);
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
    doGetSubscribedPodcastandPodcaster(0, sizeOfData + 10);
  };

  useEffect(() => {
    if (isActive) {
      setIsPageLoading(true);
      doGetSubscribedPodcastandPodcaster();
    }
    return setSubscribedPodcasters([]);
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
            {subscribedPodcasters?.length ? (
              <div className='search-result'>
                {subscribedPodcasters?.map((podcaster: any) => (
                  /* eslint-disable-next-line */
                  <div
                    className='podcasts-list podcast-frame podcasters bg-white search-item'
                    key={podcaster?.uuid}
                    onClick={() => {
                      navigate(`/podcaster-podcast/${podcaster?.uuid}`, {
                        state: { podcasterName: getUserTitle(podcaster) },
                      });
                    }}
                  >
                    <div className='position-relative text-center podcast-frame-image-box'>
                      {podcaster?.profilePhotoUrl ? (
                        <img
                          src={
                            podcaster?.profilePhotoUrl
                            && podcaster.profilePhotoUrl.startsWith(
                              'https://lh3.googleusercontent.com',
                            )
                              ? podcaster.profilePhotoUrl
                              : CLOUDINARY_URL + podcaster.profilePhotoUrl
                          }
                          alt='ads-banner'
                          className='img-fluid subscribed-podcaster-img'
                        />
                      ) : (
                        <img
                          src={UserImg}
                          alt='user'
                          className='img-fluid subscribed-podcaster-img'
                        />
                      )}
                      <div className='position-absolute user-name'>
                        <p className='m-0'>{`${podcaster?.firstName} ${podcaster?.lastName}`}</p>
                        <p className='m-0'>
                          {podcaster?.averageRating}
                          {' '}
                          <span>
                            <ColorStart />
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <h3>You have not subscribed to any podcaster.</h3>
            )}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default SubscribedPodcaster;
