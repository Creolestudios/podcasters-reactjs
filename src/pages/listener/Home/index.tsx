import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import SvgIcons from '../../../assets/svg/SvgIcons';

import Loader from '../../../components/Loader/Loader';
import AdsBanner from '../../../assets/images/1300_150_ads.png';
import LandscapeHeight from '../../../assets/images/1300_200_ads.png';
import Mood from '../../../assets/images/moods.png';
import PodcastThumbnail from '../../../assets/images/DefualtPodcastThumbnail.png';
import UserImg from '../../../assets/images/user.png';
import { CLOUDINARY_URL } from '../../../clientConfig';
import '../../../assets/scss/listener-home.scss';
import { formatTimeRemaining, getUserTitle } from '../../../utils';
import ButtonWrapper from '../../../components/form/ButtonWrapper';
import Slider from '../../../components/Slider/Slider';
import { fetchHomePageData } from '../../../redux/actions/listener/listener';
import { IState } from '../../../redux/types';
import {
  getActiveEpisode,
  getTrackStatus,
  showAudioPlayer,
} from '../../../redux/selectors/audioPlayer';
import {
  pauseAudioTrackAction,
  playAudioTrackAction,
  setAudioPlayerAction,
} from '../../../redux/actions/audioPlayer';
import { IAudioEpisode } from '../../../types';
import TooltipWrapper from '../../../components/Tooltip/TooltipWrapper';
import { OPEN_APP_ROUTES } from '../../../constant/appRoute';
import { APP_HOST, USER_ROLE } from '../../../constant';

interface IProps {
  fetchHomePageData: () => void;
  homePageLoading: boolean;
  homePageData: any;
  setAudioPlayer: (episodes: IAudioEpisode[], activeEpisodeId: string, isOpen: boolean) => void;
  isPlayTrack: boolean;
  activeAudioEpisode: IAudioEpisode | undefined;
  isAudioPlayer: boolean;
  playTrack: () => void;
  pauseTrack: () => void;
}

const ListenerHome: React.FC<IProps> = ({
  fetchHomePageData,
  homePageLoading,
  homePageData,
  setAudioPlayer,
  isPlayTrack,
  activeAudioEpisode,
  isAudioPlayer,
  playTrack,
  pauseTrack,
}) => {
  const navigate = useNavigate();
  const isSmallScreen: boolean = useMediaQuery({ query: '(max-width: 767px)' });
  const isSmallMobileScreen: boolean = useMediaQuery({
    query: '(max-width: 504px)',
  });

  const handleClick = (id: string) => {
    if (isAudioPlayer && activeAudioEpisode?.uuid === id) {
      if (isPlayTrack) {
        pauseTrack();
      } else {
        playTrack();
      }
    } else {
      setAudioPlayer(homePageData?.continueListeningEpisodes, id, true);
      playTrack();
    }
  };

  useEffect(() => {
    const ROLES = localStorage.getItem('roles')
      ? JSON.parse(localStorage.getItem('roles') ?? '')
      : null;
    const HOST = localStorage.getItem('host');
    if (ROLES?.includes(USER_ROLE.PODCASTER) && HOST === APP_HOST.PODCASTER) {
      navigate('/podcaster');
    }
    if (ROLES?.includes(USER_ROLE.ADVERTISER) && HOST === APP_HOST.ADVERTISER) {
      navigate('/advertiser');
    }
    if (ROLES?.includes(USER_ROLE.ADMIN) && HOST === APP_HOST.ADMIN) {
      navigate('/admin/dashboard');
    }
    if (!ROLES || HOST === APP_HOST.LISTENER) {
      fetchHomePageData();
    }
  }, [fetchHomePageData]);

  return homePageLoading ? (
    <div className='pt-5'>
      <Loader />
    </div>
  ) : (
    <div className='container listener-home-page'>
      {/* <div className='row'>
        <div className='col-lg-12'>
          <div className='mt-2 get-ads-free d-flex flex-lg-row flex-column flex-wrap align-items-center justify-content-md-between justify-content-center'>
            <h1> Get Ad-Free Audio Now</h1>

            <div className='d-flex align-items-center ads-free-block'>
              <div>
                Ads-Free
                <br />
                Audio
              </div>
              <div className='border-bg' />
              <div>
                Download Audio
                <br />
                on your device
              </div>
              <div className='border-bg' />
              <div>
                High Quality
                <br />
                Audio
              </div>
            </div>

            <ButtonWrapper className='view-plans-btn' onClick={() => navigate('/plans')}>
              View Plans
            </ButtonWrapper>
          </div>
        </div>
      </div> */}

      <Slider
        title='Featured Podcast'
        id='featured-podcast'
        className='featured-podcast-container'
        isSmallMobileScreen={isSmallMobileScreen}
        isSmallScreen={isSmallScreen}
        items={homePageData?.featuredPodcasts}
        seeAll={() => {
          navigate('/all-categories/feature-podcast', {
            state: {
              category: 'Featured Podcast',
              endpoint: 'featured-podcasts',
            },
          });
        }}
        ads={{
          src: 'https://cdn.mos.cms.futurecdn.net/V6LCHNxfSPT2Sxpr4bAzD-1200-80.jpg',
          link: 'https://www.creativebloq.com/news/heinz-bold-new-ads',
        }}
      />
      <Slider
        title='Continue Listening'
        id='continue-podcast'
        className='continue-podcast-container'
        isSmallMobileScreen={isSmallMobileScreen}
        isSmallScreen={isSmallScreen}
        items={homePageData?.continueListeningEpisodes}
        isSeeAllHiden
      >
        <Splide
          options={{
            perPage: 2,
            gap: '1rem',
            pagination: false,
            breakpoints: {
              320: {
                perPage: 1,
              },
              575: {
                perPage: 1,
              },
              767: {
                perPage: 2,
              },
              992: {
                perPage: 2,
              },
            },
          }}
        >
          {homePageData?.continueListeningEpisodes?.map((episode: any) => (
            <SplideSlide key={episode?.uuid}>
              <div className='podcast-frame cursor-pointer d-flex contiune-listening'>
                {/* eslint-disable-next-line */}
                <div
                  className='podcast-frame-image-box cursor-pointer'
                  onClick={() => {
                    navigate(`/podcast-details/podcast/${episode?.uuid}`);
                  }}
                >
                  <img src={episode?.episodeThumbnailImage || PodcastThumbnail} alt='' />
                </div>
                <div className='podcast-frame-title-description w-100'>
                  <p className='text-uppercase mt-4 mt-md-0 mb-3'>{episode?.categoryName}</p>
                  <TooltipWrapper tooltip={episode?.name}>
                    {/* eslint-disable-next-line */}
                    <h4
                      className='text cursor-pointer'
                      onClick={() => {
                        navigate(`/podcast-details/podcast/${episode?.uuid}`);
                      }}
                    >
                      {episode?.name}
                    </h4>
                  </TooltipWrapper>
                  <TooltipWrapper tooltip={episode?.description}>
                    <p className='text d-none d-sm-flex overflow-ellipsis'>
                      {episode?.description}
                    </p>
                  </TooltipWrapper>

                  <div className='d-flex justify-content-between align-items-center mt-3'>
                    <div>
                      <button
                        type='button'
                        className='btn-style btn-primary btn-nav resume-btn'
                        onClick={() => handleClick(episode?.uuid)}
                      >
                        {isPlayTrack && episode?.uuid === activeAudioEpisode?.uuid ? (
                          <div className='pause-audio'>
                            <SvgIcons iconType='pause-audio' className='me-2' />
                          </div>
                        ) : (
                          <SvgIcons iconType='resume-icon' className='me-2' />
                        )}
                        Resume
                      </button>
                    </div>
                    <div className='min-left'>
                      {formatTimeRemaining(episode.duration, episode.playedDuration)}
                    </div>
                  </div>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </Slider>

      {/* <div className='my-md-5 my-3'>
        <div className='row'>
          <div className='col-lg-12' />
          <div className=''>
            <img src={AdsBanner} alt='ads-banner' className='img-fluid' />
          </div>
        </div>
      </div> */}

      <Slider
        title='Top Categories'
        id='top-categories'
        className='top-categories-container'
        isSmallMobileScreen={isSmallMobileScreen}
        isSmallScreen={isSmallScreen}
        items={homePageData?.categories}
        seeAll={() => navigate('/all-categories', {
          state: { category: 'Top Categories' },
        })}
      >
        <Splide
          options={{
            perPage: 4,
            gap: '1rem',
            pagination: false,
            breakpoints: {
              575: {
                perPage: 2,
              },
              992: {
                perPage: 3,
              },
            },
          }}
        >
          {homePageData?.categories?.map((category: any) => (
            <SplideSlide key={category?.uuid}>
              {/* eslint-disable-next-line */}
              <div
                className='podcast-frame cursor-pointer d-flex align-items-center contiune-listening top-categories h-100p'
                onClick={() => {
                  navigate(`/all-categories/${category?.categoryName}`, {
                    state: {
                      category: category?.categoryName,
                      categoryUuid: category?.uuid,
                      endpoint: 'podcasts-by-category',
                    },
                  });
                }}
              >
                <div className='podcast-frame-title-description'>
                  <p className='m-0'>{category?.categoryName}</p>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </Slider>

      <Slider
        title='Your Subscribed Podcasters'
        id='subscribed-podcasters'
        className='subscribed-podcasters-container'
        isSmallMobileScreen={isSmallMobileScreen}
        isSmallScreen={isSmallScreen}
        items={homePageData?.subscribedPodcaster}
        seeAll={() => navigate('/subscriptions/podcasters')}
      >
        <Splide
          options={{
            perPage: 5,
            gap: '1rem',
            pagination: false,
            breakpoints: {
              556: {
                perPage: 2,
              },
              1060: {
                perPage: 3,
              },
              1280: {
                perPage: 4,
              },
              1600: {
                perPage: 5,
              },
            },
          }}
        >
          {homePageData?.subscribedPodcaster?.map((podcaster: any) => (
            <SplideSlide key={podcaster?.uuid}>
              <div className='podcasts-list'>
                {/* eslint-disable-next-line */}
                <div
                  className='position-relative text-center'
                  onClick={() => {
                    navigate(`/podcaster-podcast/${podcaster?.uuid}`, {
                      state: { podcasterName: getUserTitle(podcaster) },
                    });
                  }}
                >
                  {podcaster?.profilePhotoUrl ? (
                    <img
                      src={
                        podcaster?.profilePhotoUrl
                        && podcaster.profilePhotoUrl.startsWith('https://lh3.googleusercontent.com')
                          ? podcaster.profilePhotoUrl
                          : CLOUDINARY_URL + podcaster.profilePhotoUrl
                      }
                      alt='ads-banner'
                      className='img-fluid subscribed-podcaster-img'
                    />
                  ) : (
                    <img src={UserImg} alt='user' className='img-fluid subscribed-podcaster-img' />
                  )}
                  <div className='position-absolute'>
                    <p className='m-0'>{`${podcaster?.firstName} ${podcaster?.lastName}`}</p>
                  </div>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </Slider>

      {/* <div className='my-md-5 my-3'>
        <div className='row'>
          <div className='col-lg-12' />
          <div className=''>
            <img src={LandscapeHeight} alt='ads-banner' className='img-fluid' />
          </div>
        </div>
      </div> */}

      <Slider
        title='Newly Added'
        id='newly-added'
        className='newly-added-container'
        isSmallMobileScreen={isSmallMobileScreen}
        isSmallScreen={isSmallScreen}
        items={homePageData?.newlyAddedPodcast}
        seeAll={() => {
          navigate('/all-categories/newly-added', {
            state: { category: 'Newly Added', endpoint: 'newly-added-podcast' },
          });
        }}
      >
        <Splide
          options={{
            perPage: 4,
            gap: '1rem',
            pagination: false,
            breakpoints: {
              575: {
                perPage: 2,
              },
              1100: {
                perPage: 3,
              },
              1200: {
                perPage: 4,
              },
            },
          }}
        >
          {homePageData?.newlyAddedPodcast?.map((podcast: any) => (
            <SplideSlide key={podcast?.uuid}>
              {/* eslint-disable-next-line */}
              <div
                className='podcast-frame cursor-pointer newly-added'
                onClick={() => {
                  navigate(`/podcast-details/${podcast?.slugUrl}`);
                }}
              >
                <div className='podcast-frame-image-box'>
                  <img src={podcast?.podcastThumbnailImage || PodcastThumbnail} alt='' />
                </div>
                <div className='podcast-frame-title-description'>
                  <TooltipWrapper tooltip={podcast?.name}>
                    <h4 className='text'>{podcast?.name}</h4>
                  </TooltipWrapper>
                  <TooltipWrapper tooltip={podcast?.description}>
                    <p className='text'>
                      {podcast?.description?.length > 32
                        ? `${podcast?.description?.substring(0, 32)}...`
                        : podcast?.description}
                    </p>
                  </TooltipWrapper>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </Slider>

      {/* <div className='my-md-5 my-3'>
        <div className='row'>
          <div className='col-lg-12' />
          <div className=''>
            <img src={AdsBanner} alt='ads-banner' className='img-fluid' />
          </div>
        </div>
      </div> */}

      <Slider
        title='Top 10 Podcasts'
        id='top-podcasts'
        className='top-podcasts-container'
        isSmallMobileScreen={isSmallMobileScreen}
        isSmallScreen={isSmallScreen}
        items={homePageData?.topTenPodcast}
        seeAll={() => {
          navigate('/all-categories/top-podcasts', {
            state: { category: 'Top Podcasts', endpoint: 'top-podcasts' },
          });
        }}
      >
        <Splide
          options={{
            perPage: 4,
            gap: '1rem',
            pagination: false,
            breakpoints: {
              841: {
                perPage: 2,
              },
              1269: {
                perPage: 3,
              },
            },
          }}
        >
          {homePageData?.topTenPodcast?.map((podcast: any, index: number) => (
            <SplideSlide key={podcast?.uuid}>
              {/* eslint-disable-next-line */}
              <div
                className='podcast-frame cursor-pointer top-podcasts'
                onClick={() => {
                  navigate(`/podcast-details/${podcast?.slugUrl}`);
                }}
              >
                <div className='podcast-frame-image-box'>
                  <img src={podcast?.podcastThumbnailImage || PodcastThumbnail} alt='' />
                </div>
                <div className='podcast-frame-title-description position-relative d-flex'>
                  <div>
                    <h1>{index + 1}</h1>
                  </div>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </Slider>

      {/* <div className='my-md-5 my-3'>
        <div className='row'>
          <div className='col-lg-12' />
          <div className=''>
            <img src={AdsBanner} alt='ads-banner' className='img-fluid' />
          </div>
        </div>
      </div> */}

      <Slider
        title='Mood & Genres'
        id='mood-genres'
        className='mood-genres-container'
        isSmallMobileScreen={isSmallMobileScreen}
        isSmallScreen={isSmallScreen}
        items={homePageData?.sentiments}
        seeAll={() => {
          navigate('/all-categories', {
            state: { category: 'Mood & Genres' },
          });
        }}
      >
        <Splide
          options={{
            perPage: 5,
            gap: '1rem',
            pagination: false,
            breakpoints: {
              320: {
                perPage: 2,
              },
              400: {
                perPage: 2,
              },
              575: {
                perPage: 3,
              },
              992: {
                perPage: 3,
              },
              1200: {
                perPage: 4,
              },
            },
          }}
        >
          {homePageData?.sentiments?.map((sentiment: any) => (
            <SplideSlide key={sentiment}>
              {/* eslint-disable-next-line */}
              <div
                className='podcast-frame cursor-pointer mood-genres'
                onClick={() => {
                  navigate(`/all-categories/${sentiment}`, {
                    state: {
                      sentimentName: sentiment,
                      endpoint: 'sentiments/sentimentName',
                    },
                  });
                }}
              >
                <div className='podcast-frame-image-box'>
                  <img src={Mood} alt='happy' />
                </div>
                <div className='podcast-frame-title-description'>
                  <TooltipWrapper tooltip={sentiment}>
                    <h4 className='mood-text'>{sentiment}</h4>
                  </TooltipWrapper>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </Slider>

      {/* <div className='my-md-5 my-3'>
        <div className='row'>
          <div className='col-lg-12' />
          <div className=''>
            <img src={LandscapeHeight} alt='ads-banner' className='img-fluid' />
          </div>
        </div>
      </div> */}

      <Slider
        title='Listen Again'
        id='listen-again'
        className='listen-again-container'
        isSmallMobileScreen={isSmallMobileScreen}
        isSmallScreen={isSmallScreen}
        items={homePageData?.listenAgainPodcasts}
        isSeeAllHiden
      >
        <Splide
          options={{
            perPage: 4,
            gap: '1rem',
            pagination: false,
            breakpoints: {
              320: {
                perPage: 2,
              },
              400: {
                perPage: 2,
              },
              575: {
                perPage: 2,
              },
              992: {
                perPage: 3,
              },
            },
          }}
        >
          {homePageData?.listenAgainPodcasts?.map((podcast: any) => (
            <SplideSlide key={podcast?.uuid}>
              {/* eslint-disable-next-line */}
              <div
                className='podcast-frame cursor-pointer d-flex align-items-center contiune-listening top-categories listen-again'
                onClick={() => {
                  navigate(`/podcast-details/${podcast?.slugUrl}`);
                }}
              >
                <div className='podcast-frame-image-box'>
                  <img src={podcast?.podcastThumbnailImage || PodcastThumbnail} alt='' />
                </div>
                <div className='podcast-frame-title-description'>
                  <TooltipWrapper tooltip={podcast?.name}>
                    <p className='m-0'>
                      {podcast?.name?.length > 24
                        ? `${podcast?.name?.substring(0, 24)}...`
                        : podcast?.name}
                    </p>
                  </TooltipWrapper>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </Slider>
      <Slider
        title='Podcasts you follow'
        id='podcasts-you-follow'
        className='podcasts-you-follow-container'
        isSmallMobileScreen={isSmallMobileScreen}
        isSmallScreen={isSmallScreen}
        items={homePageData?.podcastYouFollow}
        seeAll={() => navigate('/subscriptions/podcasts')}
      />

      <Slider
        title='Podcasters for you'
        id='podcasters-for-you'
        className='podcasters-you-follow-container'
        isSmallMobileScreen={isSmallMobileScreen}
        isSmallScreen={isSmallScreen}
        items={homePageData?.podcasters}
        seeAll={() => navigate(`${OPEN_APP_ROUTES.PODCASTERS}`)}
      >
        <Splide
          options={{
            perPage: 5,
            gap: '1rem',
            pagination: false,
            breakpoints: {
              556: {
                perPage: 2,
              },
              1060: {
                perPage: 3,
              },
              1280: {
                perPage: 4,
              },
              1600: {
                perPage: 5,
              },
            },
          }}
        >
          {homePageData?.podcasters?.map((podcaster: any) => (
            <SplideSlide key={podcaster?.uuid}>
              <div className='podcasts-list'>
                {/* eslint-disable-next-line */}
                <div
                  className='position-relative text-center'
                  onClick={() => {
                    navigate(`/podcaster-podcast/${podcaster?.uuid}`, {
                      state: { podcasterName: getUserTitle(podcaster) },
                    });
                  }}
                >
                  {podcaster?.profilePhotoUrl ? (
                    <img
                      src={
                        podcaster?.profilePhotoUrl
                        && podcaster.profilePhotoUrl.startsWith('https://lh3.googleusercontent.com')
                          ? podcaster.profilePhotoUrl
                          : CLOUDINARY_URL + podcaster.profilePhotoUrl
                      }
                      alt='ads-banner'
                      className='img-fluid subscribed-podcaster-img'
                    />
                  ) : (
                    <img src={UserImg} alt='user' className='img-fluid subscribed-podcaster-img' />
                  )}
                  <div className='position-absolute'>
                    <p className='m-0'>{`${podcaster?.firstName} ${podcaster?.lastName}`}</p>
                  </div>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </Slider>

      {/* <div className='my-md-5 my-3'>
        <div className='row'>
          <div className='col-lg-12' />
          <div className=''>
            <img src={AdsBanner} alt='ads-banner' className='img-fluid' />
          </div>
        </div>
      </div> */}

      <Slider
        title='You may also like'
        id='you-may-lso-like'
        className='you-may-also-like-follow-container'
        isSmallMobileScreen={isSmallMobileScreen}
        isSmallScreen={isSmallScreen}
        items={homePageData?.podcastMayLikeDetails}
        seeAll={() => {
          navigate('/all-categories/may-like', {
            state: {
              category: 'You may also like',
              endpoint: 'podcasts-may-like',
            },
          });
        }}
      />

      {/* <div className='my-md-5 my-4'>
        <div className='row'>
          <div className='col-lg-12' />
          <div className=''>
            <img src={LandscapeHeight} alt='ads-banner' className='img-fluid' />
          </div>
        </div>
      </div> */}
    </div>
  );
};
const mapStateToProps = (state: IState) => ({
  homePageLoading: state.listener.homePageData.loading,
  homePageData: state.listener.homePageData.data,
  isPlayTrack: getTrackStatus(state),
  activeAudioEpisode: getActiveEpisode(state),
  isAudioPlayer: showAudioPlayer(state),
});

const mapDispatchToProps = {
  fetchHomePageData,
  setAudioPlayer: setAudioPlayerAction,
  playTrack: playAudioTrackAction,
  pauseTrack: pauseAudioTrackAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListenerHome);
