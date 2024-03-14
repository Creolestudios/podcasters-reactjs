import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import InfiniteScroll from 'react-infinite-scroll-component';
import LeftArrow from '../../../assets/svg/LeftArrow';
import { getAllCategoriesData, getPodcastWithSentiments } from '../../../services/listener/Podcast';
import { showToastMessage } from '../../../utils';
import { TOASTER_STATUS } from '../../../constant';
import Loader from '../../../components/Loader/Loader';
import Slider from '../../../components/Slider/Slider';
import AdsBanner from '../../../assets/images/1300_150_ads.png';
import FullPageLoader from '../../../components/Loader/FullPageLoader';

const AllCategories = () => {
  const navigate = useNavigate();
  const [allCategoriesData, setAllCategoriesData] = useState<Array<any>>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const location = useLocation();
  const [filterTotalCount, setFilterTotalCount] = useState<number>(0);
  const isSmallMobileScreen = useMediaQuery({ query: '(max-width: 504px)' });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const doGetAllCategoriesData = async (page: number = 0, size: number = 10) => {
    try {
      const resp: any = await getAllCategoriesData(page, size);
      if (resp?.data?.success) {
        setAllCategoriesData(resp?.data?.result?.data);
        setTotalCount(resp?.data?.result?.recordsTotal);
        setFilterTotalCount(resp?.data?.result?.recordsFiltered);
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, resp?.data?.error?.txt || 'Something went wrong!');
      }
    } catch (error: any) {
      showToastMessage(TOASTER_STATUS.ERROR, error?.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  const doGetPodcastWithSentiments = async (page: number = 0, size: number = 10) => {
    try {
      const resp: any = await getPodcastWithSentiments(page, size);
      if (resp?.data?.success) {
        setAllCategoriesData(resp?.data?.result?.data);
        setTotalCount(resp?.data?.result?.recordsTotal);
        setFilterTotalCount(resp?.data?.result?.recordsFiltered);
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, resp?.data?.error?.txt || 'Something went wrong!');
      }
    } catch (error: any) {
      showToastMessage(TOASTER_STATUS.ERROR, error?.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoreData = () => {
    switch (location?.state?.category) {
      case 'Top Categories':
        doGetAllCategoriesData(0, filterTotalCount + 10);
        break;
      case 'Mood & Genres':
        doGetPodcastWithSentiments(0, filterTotalCount + 10);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    switch (location?.state?.category) {
      case 'Top Categories':
        doGetAllCategoriesData();
        break;
      case 'Mood & Genres':
        doGetPodcastWithSentiments();
        break;
      default:
        break;
    }
  }, []);

  return isLoading ? (
    <FullPageLoader isScreenExist />
  ) : (
    <div className='container'>
      <div className='d-md-flex d-block align-items-center justify-content-between'>
        <div className='main-title d-flex align-items-center fs-36'>
          {/* eslint-disable-next-line */}
          <span
            className='me-4 forward-btn'
            onClick={() => {
              navigate(-1);
            }}
          >
            <LeftArrow />
          </span>
          {location?.state?.category === 'Mood & Genres' ? 'Mood & Genres' : 'All Categories'}
        </div>
      </div>
      <div id='infinite-scrollbar'>
        <InfiniteScroll
          dataLength={filterTotalCount}
          next={() => fetchMoreData()}
          hasMore={totalCount > filterTotalCount}
          loader={<Loader />}
        >
          {allCategoriesData?.map((category: any) => (
            <div>
              <Slider
                title={category?.categoryName || category?.sentimentName}
                id={category?.uuid}
                isSmallMobileScreen={isSmallMobileScreen}
                items={category?.podcasts?.items || category?.podcastList}
                seeAll={() => {
                  navigate(`/all-categories/${category?.categoryName || category?.sentimentName}`, {
                    state: {
                      category: category?.categoryName,
                      categoryUuid: category?.uuid,
                      sentimentName: category?.sentimentName,
                      endpoint:
                        location?.state?.category === 'Mood & Genres'
                          ? 'sentiments/sentimentName'
                          : 'podcasts-by-category',
                    },
                  });
                }}
                ads={{
                  src: 'https://xtremeads.in/wp-content/uploads/2023/07/1-Google-Ads-Company-in-India_2.webp',
                  link: 'https://xtremeads.in/google-ads/',
                }}
              />
              {/* {category?.podcasts?.items?.length || category?.podcastList?.length ? (
                <div className='my-md-5 my-3'>
                  <div className='row'>
                    <div className='col-lg-12' />
                    <div className=''>
                      <img src={AdsBanner} alt='ads-banner' className='img-fluid' />
                    </div>
                  </div>
                </div>
              ) : null} */}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AllCategories;
