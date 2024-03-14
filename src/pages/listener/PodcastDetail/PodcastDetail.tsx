import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FacebookShareButton } from 'react-share';
import PortraitLargeBanner from '../../../assets/images/420_547_ads.png';
import LandscapeLargeBanner from '../../../assets/images/860_120_ads.png';
import LeftArrow from '../../../assets/svg/LeftArrow';
import SvgIcons from '../../../assets/svg/SvgIcons';
import AuthorDetails from './AuthorDetails';
import EpisodeCardWrapper from '../../../components/CardWrapper/EpisodeCardWrapper';
import {
  favoritePodcast,
  getEpisodes,
  getFavoriteAndSubscribePodcastDetails,
  getPodcastsWithEpisode,
  getRatingPodcast,
  ratePodcast,
  subscribeUnscribePodcast,
} from '../../../services/listener/PodcastDetails';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import '../../../assets/scss/podcast-detail.scss';
import { INITIAL_PODCAST_DETAIL } from '../../../constant/listener';
import {
  downloadAudioFile,
  getLocalStorage,
  showToastMessage,
} from '../../../utils';
import { TOASTER_STATUS } from '../../../constant';
import { IPodcastDetails, IPodcast, IEpisode } from '../../../types/listener';
import IconButtonWrapper from '../../../components/IconButtonWrapper';
import Loader from '../../../components/Loader/Loader';
import { episodeDownload } from '../../../services/listener/EpisodeDetails';
import SeoHelmet from '../../../components/SeoHelmet/SeoHelmet';
import { DOMAIN_URL } from '../../../clientConfig';
import PopupButtonWrapper from '../../../components/Popup/PopupButtonWrapper';
import TooltipWrapper from '../../../components/Tooltip/TooltipWrapper';
import ColorStart from '../../../assets/svg/ColorStart';

const PodcastDetail = () => {
  const navigate = useNavigate();
  const { podcastSlug } = useParams();
  const [isSubscribe, setIsSubscribe] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [podcastDetails, setPodcastDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [podcast, setPodcast] = useState<IPodcast>(INITIAL_PODCAST_DETAIL);
  const handlePodcastDetail = (details: IPodcastDetails) => setPodcastDetails(details);
  const handleLoading = (value: boolean) => setIsLoading(value);
  const [rating, setRating] = useState<number>(0);
  const [episodesDetails, setEpisodesDetails] = useState<any>(null);
  const isAuthenticated = getLocalStorage('accessToken');

  const handleEpisodesDetails = (details: any) => {
    setEpisodesDetails(details);
  };

  const handleFavoriteAndSubscribeDetails = (resp: any) => {
    setIsFavorite(resp?.favorite);
    setIsSubscribe(resp?.subscribed);
  };

  const doGetFavoriteAndSubscribePodcastDetails = (podcastUuid: string) => {
    getFavoriteAndSubscribePodcastDetails(
      handleFavoriteAndSubscribeDetails,
      podcastUuid,
    );
  };

  const doRatePodcast = (podcastUuid: string, rating: number) => {
    ratePodcast(podcastUuid, rating);
  };

  const handleStarClick = (podcastUuid: string, selectedRating: number) => {
    if (isAuthenticated) {
      setRating(selectedRating);
      doRatePodcast(podcastUuid, selectedRating);
    } else {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        <>
          <span className='m-r-10'>Login Required! </span>
          <Link to='/login'>login</Link>
        </>,
      );
    }
  };

  const handleSubscribeDetail = (value: boolean) => setIsSubscribe(value);
  const handleFavoriteDetail = (value: boolean) => setIsFavorite(value);

  const doSubscribeUnscribePodcast = (
    podcastUuid: string,
    subscirbe: boolean,
  ) => {
    if (isAuthenticated) {
      subscribeUnscribePodcast(handleSubscribeDetail, podcastUuid, subscirbe);
    } else {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        <>
          <span className='m-r-10'>Login Required! </span>
          <Link to='/login'>login</Link>
        </>,
      );
    }
  };

  const doFavoritePodcast = (podcastUuid: string, favorite: boolean) => {
    if (isAuthenticated) {
      favoritePodcast(handleFavoriteDetail, podcastUuid, favorite);
    } else {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        <>
          <span className='m-r-10'>Login Required! </span>
          <Link to='/login'>login</Link>
        </>,
      );
    }
  };

  const handlePodcastRatingDetail = (details: any) => {
    setRating(details?.rating);
  };

  const doGetRatingPodcast = (podcastUuid: string) => {
    getRatingPodcast(handlePodcastRatingDetail, podcastUuid);
  };

  const doGetEpisodes = (page: number, size: number) => {
    getEpisodes(handleEpisodesDetails, podcastSlug || '', page, size);
  };

  const getEpisodeData = (episode: IEpisode) => ({
    thumbnailUrl: episode.episodeThumbnailImage,
    title: episode.name,
    description: episode.description,
    duration: episode.duration,
    episodeStatus: episode.episodeStatus,
    tags: episode.episodeTags,
    id: episode.uuid ?? '',
    date: episode.episodePublishedOrScheduleDate ?? 0,
    episodeUrl: episode.episodeUrl,
    episodeLikeViewCount: episode?.episodeLikeViewCount,
    likedEpisode: episode?.likedEpisode,
  });

  const getAudioEpisodes = () => podcast.episodes.map((episode: IEpisode) => ({
    name: episode.name,
    url: episode.episodeUrl,
    podcastId: episode.podcastId,
    number: episode.episodeNo,
    duration: episode.duration,
    uuid: episode.uuid,
  }));

  const getSortedEpisodes = () => {
    const { episodes } = podcast;

    return episodes.sort((prev: IEpisode, next: IEpisode) => {
      if (prev.episodeNo && next.episodeNo) {
        return prev.episodeNo - next.episodeNo;
      }
      return prev.episodeNo ?? 0;
    });
  };

  const handleDownloadAudio = async (episodeId: string, episodeUrl: string) => {
    const episode = getSortedEpisodes().find(
      (episode: any) => episode?.uuid === episodeId,
    );
    if (isAuthenticated) {
      if (episodeUrl) {
        try {
          const fileFormat = episodeUrl.split('.').pop() || '';
          downloadAudioFile(fileFormat, episodeUrl, episode?.name || '');
          await episodeDownload(episodeId);
        } catch (error) {
          showToastMessage(
            TOASTER_STATUS.ERROR,
            `'Error downloading audio:'  ${error || 'Something went wrong!'}`,
          );
        }
      }
    } else {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        <>
          <span className='m-r-10'>Login Required! </span>
          <Link to='/login'>login</Link>
        </>,
      );
    }
  };

  useEffect(() => {
    setPodcast(podcastDetails?.podcast);
    if (podcastDetails?.podcast?.uuid && isAuthenticated) {
      setRating(podcastDetails?.podcastRating?.rating);
      setIsFavorite(podcastDetails?.podcastAnalytics?.favorite);
      setIsSubscribe(podcastDetails?.podcastAnalytics?.subscribed);
    }
  }, [podcastDetails]);

  useEffect(() => {
    setPodcast({ ...podcast, episodes: episodesDetails?.data });
  }, [episodesDetails]);

  useEffect(() => {
    handleLoading(true);
    getPodcastsWithEpisode(
      handlePodcastDetail,
      handleLoading,
      podcastSlug || '',
    );
  }, []);

  return (
    <>
      <SeoHelmet
        displayTitle={podcastDetails?.podcast?.name}
        metaDescription={podcastDetails?.podcast?.description}
        metaUrl={`${DOMAIN_URL}podcast-details/${podcastSlug}`}
        metaImageUrl={podcastDetails?.podcast?.podcastCoverImage}
      />
      {isLoading && <FullPageLoader isScreenExist />}
      {podcastDetails && (
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12'>
              <div className='d-md-flex block align-items-center justify-content-between main-div'>
                <div className='main-title d-flex align-items-center flex-wrap'>
                  {/* eslint-disable-next-line */}
                  <span
                    className='me-4 d-flex forward-btn'
                    onClick={() => navigate(-1)}
                  >
                    <LeftArrow />
                  </span>
                  <TooltipWrapper
                    tooltip={podcastDetails?.podcast?.name}
                    overlayProps={{ placement: 'bottom' }}
                  >
                    {podcastDetails?.podcast?.name.length > 30
                      ? `${podcastDetails?.podcast?.name.slice(0, 30)}...`
                      : podcastDetails?.podcast?.name.slice(0, 30)}
                  </TooltipWrapper>
                  {!isSubscribe ? (
                    // eslint-disable-next-line
                    <span
                      onClick={() => {
                        doSubscribeUnscribePodcast(
                          podcastDetails?.podcast?.uuid,
                          true,
                        );
                      }}
                      className='subscribe-listener'
                    >
                      <SvgIcons iconType='notification-icon' />
                      Subscribe
                    </span>
                  ) : (
                    // eslint-disable-next-line
                    <span
                      onClick={() => {
                        doSubscribeUnscribePodcast(
                          podcastDetails?.podcast?.uuid,
                          false,
                        );
                      }}
                      className='subscribe-listener subscribed'
                    >
                      <SvgIcons iconType='notification-icon' />
                      Subscribed
                    </span>
                  )}
                </div>

                <div className='d-flex flex-wrap align-items-center justify-content-end like-share'>
                  {/* eslint-disable-next-line */}
                  <div
                    className='me-3 cursor-pointer'
                    onClick={() => {
                      doFavoritePodcast(
                        podcastDetails?.podcast?.uuid,
                        !isFavorite,
                      );
                    }}
                  >
                    {isFavorite ? (
                      <SvgIcons iconType='liked-icon' />
                    ) : (
                      <SvgIcons iconType='like-icon' />
                    )}
                  </div>
                  <PopupButtonWrapper
                    isIcon
                    IconName={SvgIcons}
                    iconType='share-icon'
                    popupElement={(
                      <div>
                        <FacebookShareButton
                          url={`${DOMAIN_URL}podcast-details/${podcastSlug}`}
                        >
                          <IconButtonWrapper
                            IconName={SvgIcons}
                            iconType='fb-icon'
                            onClick={() => {}}
                          />
                        </FacebookShareButton>
                        <IconButtonWrapper
                          IconName={SvgIcons}
                          iconType='linkedin-icon-box'
                          onClick={() => {
                            const url = encodeURIComponent(
                              `${DOMAIN_URL}podcast-details/${podcastSlug}`,
                            );
                            window.open(
                              `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                              '_blank',
                            );
                          }}
                        />

                        <CopyToClipboard
                          text={`${DOMAIN_URL}podcast-details/${podcastSlug}`}
                          onCopy={() => {
                            showToastMessage(
                              TOASTER_STATUS.SUCCESS,
                              'Link Copied Successfully',
                            );
                          }}
                        >
                          <IconButtonWrapper
                            IconName={SvgIcons}
                            iconType='link-icon'
                            onClick={() => {}}
                          />
                        </CopyToClipboard>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <div className='subscribe-main-bg'>
                <img
                  src={podcastDetails?.podcast?.podcastCoverImage}
                  alt='podcast-banner'
                  className='img-fluid'
                />
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-8'>
              <div className='listener-episodes'>
                {/* <div className='mt-md-0 mt-3 mb-md-4 mb-3'>
                  <img
                    src={LandscapeLargeBanner}
                    alt='ads-banner'
                    className='img-fluid'
                  />
                </div> */}
                <div className='listerner-star w-100'>
                  <div className='star-line mb-3'>
                    <div className='star-line'>
                      {[...Array(5)].map((star, index) => {
                        const starValue = index + 1;
                        return (
                          // eslint-disable-next-line
                          <label key={index}>
                            <input
                              type='radio'
                              name='rating'
                              value={starValue}
                              onClick={() => {
                                handleStarClick(
                                  podcastDetails?.podcast?.uuid,
                                  starValue,
                                );
                              }}
                            />

                            {starValue <= rating ? (
                              <span className='cursor-pointer'>
                                <ColorStart />
                              </span>
                            ) : (
                              <span className='cursor-pointer'>
                                <SvgIcons iconType='star-icon' />
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className='mb-3 mt-3 mt-xl-0'>
                    <span className='time'>
                      {podcastDetails?.podcast?.category?.name}
                    </span>
                    <span className='time'>
                      {podcastDetails?.podcast?.podcastCountry}
                    </span>
                    <span className='time'>
                      {podcastDetails?.podcast?.podcastLanguage}
                    </span>
                  </div>
                  <p>{podcastDetails?.podcast?.description}</p>
                  <div className='play-details'>
                    <div className='d-flex align-items-center flex-wrap'>
                      <div className='tags-btn mt-0'>
                        {podcastDetails?.podcast?.podcastTags?.map(
                          (tag: any) => (
                            <span className='badge bg-primary'>
                              {tag?.tagName}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='d-flex align-items-center flex-wrap justify-content-between episodes-list listener-b-title margin-manage'>
                  <div className='episodes'>Episodes</div>
                </div>
                {podcast?.episodes?.length > 0 ? (
                  <div id='infinite-scrollbar'>
                    <InfiniteScroll
                      dataLength={podcast?.episodes?.length}
                      next={() => {
                        doGetEpisodes(0, podcast.episodes.length + 10);
                      }}
                      hasMore={
                        podcast?.totalEpisodes > podcast?.episodes?.length
                      }
                      loader={<Loader />}
                    >
                      {getSortedEpisodes().map((episode: IEpisode) => (
                        <EpisodeCardWrapper
                          key={episode.uuid}
                          columns='col-lg-12'
                          isReadonly
                          data={getEpisodeData(episode)}
                          audioEpisodes={getAudioEpisodes()}
                          handleIconClick={(type, episodeId, episodeUrl) => handleDownloadAudio(episodeId, episodeUrl || '')}
                          isListener
                        />
                      ))}
                    </InfiniteScroll>
                  </div>
                ) : (
                  <p>No Episode Found</p>
                )}
              </div>
            </div>
            <div className='col-lg-4'>
              <AuthorDetails author={podcastDetails?.podcastAuthor} />
              {/* <div className='text-center'>
                <img
                  src={PortraitLargeBanner}
                  alt='ads-banner'
                  className='img-fluid'
                />
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PodcastDetail;
