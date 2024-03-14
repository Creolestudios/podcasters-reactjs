import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/Loader/Loader';
import { getDownloadedEpisodes } from '../../../services/listener/Podcast';
import BackButton from '../../../components/BackButton';
import '../../../assets/scss/podcast-history.scss';
import { IDownloadEpisode, IEpisode } from '../../../types/listener';
import EpisodeCardWrapper from '../../../components/CardWrapper/EpisodeCardWrapper';
import PortraitLargeBanner from '../../../assets/images/420_547_ads.png';
import LandscapeLargeBanner from '../../../assets/images/860_120_ads.png';
import LandscapeSmallBanner from '../../../assets/images/420_250_ads.png';
import SearchInputWrapper from '../../../components/SearchInputWrapper';
import { useDebounce } from '../../../hooks/useDebounce';
import '../../../assets/scss/download-episode.scss';

const DownloadPage = () => {
  const navigate = useNavigate();

  const [episodes, setEpisodes] = useState<[IDownloadEpisode] | []>([]);
  const [filterTotal, setFilterTotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [sizeOfData, setSizeOfData] = useState<number>(0);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearch = useDebounce(searchValue, 1000);
  const [isAdsAvailable, setIsAdsAvailable] = useState<boolean>(false);

  const handlePageLoading = (loading: boolean) => {
    setIsPageLoading(loading);
  };

  const handleEpisodeDetails = (details: any) => {
    setEpisodes(details?.data);
    setFilterTotal(details?.recordsFiltered);
    setTotal(details?.recordsTotal);
  };

  const handleSizeOfData = (size: number) => {
    setSizeOfData(size);
  };

  const getEpisodeData = (episode: IEpisode) => ({
    thumbnailUrl: episode.episodeThumbnailImage,
    title: episode.name,
    description: episode.description,
    episodeStatus: episode.episodeStatus,
    duration: episode.duration,
    tags: episode.episodeTags,
    id: episode.uuid ?? '',
    date: episode.episodePublishedOrScheduleDate ?? 0,
    episodeUrl: episode.episodeUrl,
    episodeLikeViewCount: episode?.episodeLikeViewCount,
    likedEpisode: episode?.likedEpisode,
  });

  const getAudioEpisodes = () => episodes.map((episode: IEpisode, index: number) => ({
    name: episode.name,
    url: episode.episodeUrl,
    podcastId: episode.podcastId,
    number: index + 1,
    duration: episode.duration,
    uuid: episode.uuid,
  }));

  const doGetDownloadedEpisodes = (
    page: number = 0,
    size: number = 5,
    searchString: string = searchValue,
  ) => {
    getDownloadedEpisodes(
      handleEpisodeDetails,
      handleSizeOfData,
      handlePageLoading,
      page,
      size,
      searchString,
    );
  };

  const fetchMoreData = () => {
    doGetDownloadedEpisodes(0, sizeOfData + 10);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    handlePageLoading(true);
    doGetDownloadedEpisodes();
  }, [debouncedSearch]);

  return (
    <div>
      <div className='download-episode-page podcast-item-list-container'>
        <div className='row'>
          <div className='col-lg-12 d-flex justify-content-between mb-2'>
            <BackButton text='Downloads' onClick={() => navigate(-1)} />
            <div className='m-r-2 d-flex align-items-center'>
              <SearchInputWrapper searchValue={searchValue} handleSearch={handleSearch} />
            </div>
          </div>
        </div>
        {isPageLoading ? (
          <Loader />
        ) : (
          <div>
            {episodes?.length > 0 ? (
              <div className='row'>
                <div className={isAdsAvailable ? 'col-lg-8' : 'col-lg-12'}>
                  <div id='infinite-scrollbar'>
                    <InfiniteScroll
                      dataLength={filterTotal}
                      next={() => fetchMoreData()}
                      hasMore={total > filterTotal}
                      loader={<Loader />}
                    >
                      {episodes.map((episode: IEpisode) => (
                        <EpisodeCardWrapper
                          key={episode.uuid}
                          columns='col-lg-12'
                          isReadonly
                          data={getEpisodeData(episode)}
                          audioEpisodes={getAudioEpisodes()}
                          isListener
                          showActionButton={false}
                        />
                      ))}
                    </InfiniteScroll>
                  </div>
                </div>
                {/* <div className='col-lg-4'>
                <div className='text-center mb-md-4 mb-3'>
                  <img src={PortraitLargeBanner} alt='ads-banner' className='img-fluid' />
                </div>

                <div className='text-center mb-md-4 mb-3'>
                  <img src={LandscapeSmallBanner} alt='ads-banner' className='img-fluid' />
                </div>
              </div> */}
              </div>
            ) : (
              <h3>No Episode Found</h3>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
