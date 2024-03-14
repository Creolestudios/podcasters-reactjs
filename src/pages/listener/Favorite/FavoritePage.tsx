import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/Loader/Loader';
import PodcastItem from '../../../components/Podcast/PodcastItem';
import { getFavoritesPodcast } from '../../../services/listener/Podcast';
import BackButton from '../../../components/BackButton';
import { CLOUDINARY_URL } from '../../../clientConfig';

const FavoritePage = () => {
  const [favoritePodcasts, setFavoritePodcasts] = useState<any>([]);
  const [filterTotal, setFilterTotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [sizeOfData, setSizeOfData] = useState<number>(0);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handlePageLoading = (loading: boolean) => {
    setIsPageLoading(loading);
  };

  const handlePodcastDetails = (details: any) => {
    setFavoritePodcasts(details?.data);
    setFilterTotal(details?.recordsFiltered);
    setTotal(details?.recordsTotal);
  };

  const handleSizeOfData = (size: number) => {
    setSizeOfData(size);
  };

  const doGetFavoritesPodcast = (
    page: number = 0,
    size: number = 10,
    searchString: string = '',
  ) => {
    getFavoritesPodcast(
      handlePodcastDetails,
      handleSizeOfData,
      handlePageLoading,
      page,
      size,
      searchString,
    );
  };

  const fetchMoreData = () => {
    doGetFavoritesPodcast(0, sizeOfData + 10);
  };

  useEffect(() => {
    handlePageLoading(true);
    doGetFavoritesPodcast();
  }, []);

  return (
    <div>
      {isPageLoading ? (
        <Loader />
      ) : (
        <div className='favorite-page podcast-item-list-container'>
          <div className='row'>
            <div className='col-lg-12'>
              <BackButton text='Favorites' onClick={() => navigate(-1)} />
            </div>
          </div>
          {/* {favoritePodcasts?.length ? (
            <div className='mb-md-5 mb-3'>
              <div className='row'>
                <div className='col-lg-12' />
                <div className=''>
                  <img
                    src={`${CLOUDINARY_URL}Images/1300_150_ad.png`}
                    alt='ads-banner'
                    className='img-fluid'
                  />
                </div>
              </div>
            </div>
          ) : null} */}
          <div id='infinite-scrollbar'>
            <InfiniteScroll
              dataLength={filterTotal}
              next={() => fetchMoreData()}
              hasMore={total > filterTotal}
              loader={<Loader />}
            >
              {favoritePodcasts?.length ? (
                <div className='search-result'>
                  {favoritePodcasts?.map((podcast: any) => (
                    <PodcastItem podcast={podcast} className='search-item' />
                  ))}
                </div>
              ) : (
                <h3>You have not Favorited any podcast.</h3>
              )}
            </InfiniteScroll>
          </div>
          {/* {favoritePodcasts?.length ? (
            <div className='my-md-5 my-3'>
              <div className='row'>
                <div className='col-lg-12' />
                <div className=''>
                  <img
                    src={`${CLOUDINARY_URL}Images/1300_150_ad.png`}
                    alt='ads-banner'
                    className='img-fluid'
                  />
                </div>
              </div>
            </div>
          ) : null} */}
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
