import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation, useNavigate } from 'react-router-dom';
import LeftArrow from '../../../assets/svg/LeftArrow';
import {
  getCategoryData,
  getFeaturedPodcasts,
  getPodcastByCategoryId,
  getPodcastBySentimentName,
} from '../../../services/listener/Podcast';
import PodcastItem from '../../../components/Podcast/PodcastItem';
import Loader from '../../../components/Loader/Loader';
import { TOASTER_STATUS } from '../../../constant';
import { showToastMessage } from '../../../utils';

const Category = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [filterTotal, setFilterTotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [sizeOfData, setSizeOfData] = useState<number>(0);

  const doGetCategoryData = async (endpoint: string, page: number = 0, size: number = 10) => {
    try {
      const resp = await getCategoryData(endpoint, page, size);
      if (resp?.data?.success) {
        setData(resp?.data?.result?.data);
        setFilterTotal(resp?.data?.result?.recordsFiltered);
        setTotal(resp?.data?.result?.recordsTotal);
        setSizeOfData(size);
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, resp?.data?.error?.txt || 'Something went wrong!');
      }
    } catch (error: any) {
      showToastMessage(TOASTER_STATUS.ERROR, error?.message || 'Something went wrong!');
    }
  };

  const doGetFeaturedPodcastData = async (
    search: string = '',
    page: number = 0,
    size: number = 10,
  ) => {
    try {
      const resp = await getFeaturedPodcasts(search, page, size);
      if (resp?.data?.success) {
        setData(resp?.data?.result?.data);
        setFilterTotal(resp?.data?.result?.recordsFiltered);
        setTotal(resp?.data?.result?.recordsTotal);
        setSizeOfData(size);
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, resp?.data?.error?.txt || 'Something went wrong!');
      }
    } catch (error: any) {
      showToastMessage(TOASTER_STATUS.ERROR, error?.message || 'Something went wrong!');
    }
  };
  const doGetPodcastByCategoryId = async (uuid: string, page: number = 0, size: number = 10) => {
    try {
      const resp = await getPodcastByCategoryId(uuid, page, size);
      if (resp?.data?.success) {
        setData(resp?.data?.result?.podcasts?.items);
        setFilterTotal(resp?.data?.result?.podcasts?.items?.length);
        setTotal(resp?.data?.result?.podcasts?.totalItems);
        setSizeOfData(size);
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, resp?.data?.error?.txt || 'Something went wrong!');
      }
    } catch (error: any) {
      showToastMessage(TOASTER_STATUS.ERROR, error?.message || 'Something went wrong!');
    }
  };
  const doGetPodcastBySentimentName = async (
    sentimentName: string = '',
    page: number = 0,
    size: number = 10,
  ) => {
    try {
      const resp = await getPodcastBySentimentName(sentimentName, page, size);
      if (resp?.data?.success) {
        setData(resp?.data?.result?.data);
        setFilterTotal(resp?.data?.result?.recordsFiltered);
        setTotal(resp?.data?.result?.recordsTotal);
        setSizeOfData(size);
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, resp?.data?.error?.txt || 'Something went wrong!');
      }
    } catch (error: any) {
      showToastMessage(TOASTER_STATUS.ERROR, error?.message || 'Something went wrong!');
    }
  };

  const fetchMoreData = () => {
    switch (location?.state?.endpoint) {
      case 'featured-podcasts':
        doGetFeaturedPodcastData('', 0, sizeOfData + 10);
        break;
      case 'newly-added-podcast':
        doGetCategoryData(location?.state?.endpoint, 0, sizeOfData + 10);
        break;
      case 'top-podcasts':
        doGetCategoryData(location?.state?.endpoint, 0, sizeOfData + 10);
        break;
      case 'listen-again-podcasts':
        doGetCategoryData(location?.state?.endpoint, 0, sizeOfData + 10);
        break;
      case 'podcasts-may-like':
        doGetCategoryData(location?.state?.endpoint, 0, sizeOfData + 10);
        break;
      case 'sentiments/sentimentName':
        doGetPodcastBySentimentName(location?.state?.sentimentName, 0, sizeOfData + 10);
        break;
      default:
        doGetPodcastByCategoryId(location?.state?.categoryUuid, 0, sizeOfData + 10);
        break;
    }
  };
  useEffect(() => {
    switch (location?.state?.endpoint) {
      case 'featured-podcasts':
        doGetFeaturedPodcastData();
        break;
      case 'newly-added-podcast':
        doGetCategoryData(location?.state?.endpoint);
        break;
      case 'top-podcasts':
        doGetCategoryData(location?.state?.endpoint);
        break;
      case 'listen-again-podcasts':
        doGetCategoryData(location?.state?.endpoint);
        break;
      case 'podcasts-may-like':
        doGetCategoryData(location?.state?.endpoint);
        break;
      case 'sentiments/sentimentName':
        doGetPodcastBySentimentName(location?.state?.sentimentName);
        break;
      default:
        doGetPodcastByCategoryId(location?.state?.categoryUuid);
        break;
    }
  }, []);
  return (
    <div className='podcast-item-list-container'>
      <div className='d-md-flex d-block align-items-center justify-content-between'>
        <div className='main-title d-flex align-items-center flex-column w-100'>
          <div className='d-flex align-items-center w-100 m-b-20'>
            {/* eslint-disable-next-line */}
            <span
              className='me-4 forward-btn'
              onClick={() => {
                navigate(-1);
              }}
            >
              <LeftArrow />
            </span>
            <span>{location?.state?.category || location?.state?.sentimentName}</span>
          </div>
          <div id='infinite-scrollbar' className='w-100'>
            <InfiniteScroll
              dataLength={data?.length}
              next={() => fetchMoreData()}
              hasMore={total > filterTotal}
              loader={<Loader />}
            >
              <div className='search-result'>
                {data?.map((podcast: any) => (
                  <PodcastItem podcast={podcast} className='search-item' />
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
