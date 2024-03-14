import React, {
  ChangeEvent, FC, useEffect, useState,
} from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { FacebookShareButton } from 'react-share';
import CopyToClipboard from 'react-copy-to-clipboard';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchInputWrapper from '../../../components/SearchInputWrapper';
import ButtonWrapper from '../../../components/form/ButtonWrapper';
import IconButtonWrapper from '../../../components/IconButtonWrapper';
import EpisodeCardWrapper from '../../../components/CardWrapper/EpisodeCardWrapper';
import {
  createRssFeed,
  deletePodcast,
  getEpisodes,
  getPodcastDetail,
  updatePodcastMonetization,
} from '../../../services/podcaster/Podcast';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import {
  getInTitleCase,
  getTitle,
  getDate,
  getTimeFromDate,
  showToastMessage,
} from '../../../utils';
import BackButton from '../../../components/BackButton';
import { INITIAL_PODCAST_DETAIL } from '../../../constant/podcast';
import { PODCAST_STATUS, TOASTER_STATUS } from '../../../constant';
import { showAudioPlayer } from '../../../redux/selectors/audioPlayer';
import { closeAudioPlayerAction } from '../../../redux/actions/audioPlayer';
import { PODCASTER_APP_ROUTES as PODCASTER_ROUTES } from '../../../constant/appRoute';

import { IEpisode, IPodcastDetail } from '../../../types/podcaster';
import { IState } from '../../../redux/types';
import LeftArrow from '../../../assets/svg/LeftArrow';
import SvgIcons from '../../../assets/svg/SvgIcons';
import rightSideLogin from '../../../assets/images/rightSideLogin.svg';
import '../../../assets/scss/podcast-detail.scss';
import ModalWrapper from '../../../components/form/ModalWrapper';
import EmbedCode from '../../../components/EmbedCode/EmbedCode';
import { DOMAIN_URL } from '../../../clientConfig';
import Loader from '../../../components/Loader/Loader';
import { useDebounce } from '../../../hooks/useDebounce';
import { IOpen } from '../../../types';
import { deleteEpisode } from '../../../services/podcaster/Episode';
import TooltipWrapper from '../../../components/Tooltip/TooltipWrapper';
import DeleteModal from '../../../components/Modal/DeleteModal';
import ColorStart from '../../../assets/svg/ColorStart';

interface IProps {
  hasAudioPlayer: boolean;
  closeAudioPlayer: () => void;
}

const PodcastDetailPage: FC<IProps> = ({
  hasAudioPlayer,
  closeAudioPlayer,
}) => {
  const { podcastSlug } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [podcast, setPodcast] = useState<IPodcastDetail>(
    INITIAL_PODCAST_DETAIL,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmbedPopupOpen, setIsEmbedPopupOpen] = useState<boolean>(false);
  const [distributionLoading, setDistributionLoading] = useState<boolean>(false);
  const [episodesDetails, setEpisodesDetails] = useState<any>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearch = useDebounce(searchValue, 1000);
  const [total, setTotal] = useState<number>(0);
  const [openDelete, setOpenDelete] = useState<IOpen>({
    isOpen: false,
    id: null,
  });
  const [isDeletePodcast, setIsDeletePodcast] = useState<boolean>(false);
  const [isDisabled, setIsDisaabled] = useState<boolean>(false);

  const handleDisable = (value: boolean) => setIsDisaabled(value);

  const handleClose = () => setOpenDelete({ isOpen: false, id: null });
  const handleLoading = (value: boolean) => setIsLoading(value);
  const handleDistributionLoading = (value: boolean) => setDistributionLoading(value);
  const handlePodcastDetail = (value: IPodcastDetail) => {
    setPodcast({ ...podcast, ...value });
    setTotal(value.totalEpisodes);
  };

  useEffect(() => {
    if (podcastSlug) {
      handleLoading(true);
      getPodcastDetail(podcastSlug, handlePodcastDetail, handleLoading);
    }

    return () => {
      closeAudioPlayer();
    };
  }, []);

  const closeEmbedPopup = () => {
    setIsEmbedPopupOpen(false);
  };

  const handleCloseDeleteModal = (value: boolean) => setOpenDelete({ isOpen: value, id: null });

  const handlePodcastMonetization = (event: ChangeEvent<HTMLInputElement>) => {
    if (podcast.uuid) {
      updatePodcastMonetization(podcast.uuid, event.target.checked);
      setPodcast({ ...podcast, monetized: event.target.checked });
    }
  };

  const getEpisodeData = (episode: IEpisode) => ({
    thumbnailUrl: episode.episodeThumbnailImage,
    title: episode.name,
    description: episode.description,
    duration: episode.duration,
    tags: episode.episodeTags,
    episodeStatus: episode.episodeStatus,
    id: episode.uuid ?? '',
    date: episode.episodePublishedOrScheduleDate ?? 0,
    episodeNo: episode.episodeNo,
  });

  const getAudioEpisodes = () => podcast.episodes.map((episode: IEpisode) => ({
    name: episode.name,
    url: episode.episodeUrl,
    podcastId: episode.podcastId,
    number: episode.episodeNo,
    duration: episode.duration,
    uuid: episode.uuid,
  }));

  const onBack = () => navigate(PODCASTER_ROUTES.ROOT);
  const getSortedEpisodes = () => {
    const { episodes } = podcast;

    return episodes.sort((prev: IEpisode, next: IEpisode) => {
      if (prev.episodeNo && next.episodeNo) {
        return prev.episodeNo - next.episodeNo;
      }
      return prev.episodeNo ?? 0;
    });
  };

  const onAddEpisode = () => {
    navigate(PODCASTER_ROUTES.ADD_EPISODE, {
      state: { podcastId: podcast.uuid },
    });
  };

  const onEditEpisode = (episodeId: string) => {
    navigate(`${pathname}/${episodeId}/${PODCASTER_ROUTES.EDIT}`, {
      state: { podcastId: podcast.uuid },
    });
  };

  const onEditPodcast = () => {
    navigate(`${pathname}/${PODCASTER_ROUTES.EDIT}`, {
      state: { podcastId: podcast.uuid, slug: podcast.slugUrl },
    });
  };

  const onAnalytics = () => {
    navigate(`${PODCASTER_ROUTES.ROOT}/${PODCASTER_ROUTES.ANALYTICS}`, {
      state: {
        podcastId: podcast.uuid,
        pathName: pathname,
        podcastName: podcast?.name,
      },
    });
  };

  const onContinue = (isRssFeedCreated: boolean) => {
    if (isRssFeedCreated) {
      navigate(`${PODCASTER_ROUTES.ROOT}/${PODCASTER_ROUTES.DISTRIBUTION}`, {
        state: { podcastSlug },
      });
    }
  };

  const onDistribution = () => {
    handleDistributionLoading(true);
    if (podcastSlug) createRssFeed(podcastSlug, handleDistributionLoading, onContinue);
  };

  const handleEpisodesDetails = (details: any) => {
    setEpisodesDetails(details);
    setTotal(details?.recordsTotal);
  };

  const doGetEpisodes = (
    page: number = 0,
    size: number = 5,
    searchString: string = searchValue,
  ) => {
    getEpisodes(
      handleEpisodesDetails,
      podcastSlug || '',
      page,
      size,
      searchString,
    );
  };

  const onDeleteEpisode = (episodeId: string) => {
    if (total > 1) {
      setOpenDelete({
        isOpen: true,
        id: episodeId,
      });
    } else {
      setIsDeletePodcast(true);
    }
  };

  const onConfirmDelete = () => {
    handleDisable(true);
    deleteEpisode(openDelete?.id ?? '', handleDisable, doGetEpisodes);
    setOpenDelete({
      isOpen: false,
      id: null,
    });
  };

  const onConfirmDeletePodcast = async () => {
    handleDisable(true);
    const podcastId = podcast?.uuid || '';
    try {
      const response = await deletePodcast(podcastId);
      if (response?.data?.success) {
        showToastMessage(TOASTER_STATUS.SUCCESS, response?.data?.result);
        onBack();
      }
    } catch (error: any) {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        error?.response?.data?.result?.errorMessage || 'Something Went Wrong!',
      );
    } finally {
      handleDisable(false);
      setIsDeletePodcast(false);
    }
  };

  const handleEpisodeAction = (type: string, episodeId: string) => {
    if (type === 'edit') {
      onEditEpisode(episodeId);
    } else if (type === 'delete') {
      onDeleteEpisode(episodeId);
    }
  };

  useEffect(() => {
    setPodcast({ ...podcast, episodes: episodesDetails?.data });
  }, [episodesDetails]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    doGetEpisodes();
  }, [debouncedSearch]);

  return (
    <div className={hasAudioPlayer ? 'container p-b-100' : 'container'}>
      {!isLoading && (
        <>
          <BackButton
            text='Podcast Detail'
            onClick={onBack}
            isShow
            customElement={(
              <SearchInputWrapper
                searchValue={searchValue}
                handleSearch={handleSearch}
              />
            )}
          />

          <div className='row'>
            <div className='col-xl-12 res-p-0'>
              <div className='podcast-details-view podcast-details-container d-block d-lg-flex'>
                <div className='img-block'>
                  <img
                    src={
                      podcast.podcastThumbnailImage
                      && podcast.podcastThumbnailImage !== ''
                        ? podcast.podcastThumbnailImage
                        : rightSideLogin
                    }
                    className='img-fluid d-block mx-auto podcast-detail-thumbnail'
                    alt='podcast'
                  />
                  <div className='views-number mb-4 mb-lg-0 d-flex justify-content-between'>
                    <div className='d-flex align-items-center justify-content-center flex-column w-100'>
                      <h2>
                        {podcast.numberOfViews ? podcast.numberOfViews : 0}
                      </h2>
                      <p className='mb-0'>Views</p>
                    </div>
                    <div className='border-right' />
                    <div className='d-flex align-items-center justify-content-center flex-column w-100'>
                      <h2 className='d-flex align-items-center'>
                        {podcast.averageRating ? podcast.averageRating : 0}
                        {' '}
                        <span className='m-t-n6'>
                          <ColorStart />
                        </span>
                      </h2>
                      <p className='mb-0'>Avg Ratings</p>
                    </div>
                  </div>
                </div>
                <div className='podcast-details-box'>
                  <div className='block d-xl-flex justify-content-between align-items-start'>
                    <div className='flex-1 m-r-5'>
                      <h1>
                        <TooltipWrapper
                          tooltip={podcast.name}
                          overlayProps={{ placement: 'top' }}
                        >
                          {podcast.name.length > 45
                            ? `${getTitle(podcast.name.slice(0, 45))}...`
                            : getTitle(podcast.name)}
                        </TooltipWrapper>
                      </h1>
                    </div>
                    <div className='monetize-checkbox d-flex flex-wrap align-items-center'>
                      <div className='monetize-check'>
                        <div className='radio-btn d-flex justify-content-start align-items-center'>
                          <input
                            type='checkbox'
                            id='monetizePodcast'
                            name='monetizePodcast'
                            onChange={handlePodcastMonetization}
                            checked={podcast.monetized}
                          />
                          {/* eslint-disable-next-line */}
                          <label htmlFor='monetizePodcast' className='checkbox'>
                            Monetize this Podcast
                          </label>
                        </div>
                      </div>
                      <IconButtonWrapper
                        IconName={SvgIcons}
                        iconType='icon_edit'
                        onClick={onEditPodcast}
                      />
                      <IconButtonWrapper
                        IconName={SvgIcons}
                        iconType='icon_analysis'
                        onClick={onAnalytics}
                      />
                    </div>
                  </div>
                  <div className='mb-3 mt-3'>
                    <div
                      className={`status-block status-block-${podcast.podcastStatus.toLowerCase()}`}
                    >
                      <div className={`${podcast.podcastStatus.toLowerCase()}`}>
                        <span>&#9679;</span>
                        <div>{getInTitleCase(podcast.podcastStatus)}</div>
                      </div>
                    </div>
                    {PODCAST_STATUS.PUBLISH
                      === podcast.podcastStatus.toLowerCase()
                      && podcast.publishedDate && (
                        <>
                          <span className='time'>
                            {getDate(podcast.publishedDate, 'DD/MM/YYYY')}
                          </span>
                          <span className='time'>
                            {getTimeFromDate(podcast.publishedDate, 'h:mm A')}
                          </span>
                        </>
                    )}
                  </div>
                  <div className='mb-0'>
                    {PODCAST_STATUS.PUBLISH
                      === podcast.podcastStatus.toLowerCase() && (
                      <p>
                        This episode has been
                        {' '}
                        <span>Published</span>
                        {' '}
                        and can be
                        heard everywhere your podcast is available.
                      </p>
                    )}

                    {PODCAST_STATUS.DRAFT
                      === podcast.podcastStatus.toLowerCase() && (
                      <p>
                        This episode is currently in
                        {' '}
                        <span>Draft</span>
                        . It is
                        not yet published, but you can continue working on it.
                      </p>
                    )}
                  </div>

                  <div className='icon-list d-flex flex-wrap'>
                    <FacebookShareButton
                      disabled={
                        podcast.podcastStatus.toLowerCase() !== 'published'
                      }
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
                      isDisabled={
                        podcast.podcastStatus.toLowerCase() !== 'published'
                      }
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
                        if (
                          podcast.podcastStatus.toLowerCase() === 'published'
                        ) {
                          showToastMessage(
                            TOASTER_STATUS.SUCCESS,
                            'Link Copied Successfully',
                          );
                        }
                      }}
                    >
                      <IconButtonWrapper
                        IconName={SvgIcons}
                        iconType='link-icon'
                        onClick={() => {}}
                        isDisabled={
                          podcast.podcastStatus.toLowerCase() !== 'published'
                        }
                      />
                    </CopyToClipboard>

                    <IconButtonWrapper
                      IconName={SvgIcons}
                      iconType='code-icon'
                      onClick={() => {
                        setIsEmbedPopupOpen(true);
                      }}
                      isDisabled={
                        podcast.podcastStatus.toLowerCase() !== 'published'
                      }
                    />
                    {!distributionLoading ? (
                      <IconButtonWrapper
                        IconName={SvgIcons}
                        iconType='distributions-icon'
                        onClick={onDistribution}
                        isDisabled={
                          distributionLoading
                          || podcast.podcastStatus.toLowerCase() !== 'published'
                        }
                      />
                    ) : (
                      <ButtonWrapper className='distriubtion-loading-btn btn-style'>
                        <Loader />
                      </ButtonWrapper>
                    )}
                  </div>

                  <div className='detalis-scroll-view'>
                    {podcast.description}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-xl-12'>
              <div className='d-flex align-items-center flex-wrap justify-content-between episodes-list'>
                <div className='episodes'>Episodes</div>
                <ButtonWrapper onClick={onAddEpisode}>Add New</ButtonWrapper>
              </div>
              {podcast.episodes?.length > 0 ? (
                <div id='infinite-scrollbar'>
                  <InfiniteScroll
                    dataLength={podcast?.episodes?.length}
                    next={() => {
                      doGetEpisodes(0, podcast.episodes.length + 10);
                    }}
                    hasMore={total > podcast?.episodes?.length}
                    loader={<Loader />}
                  >
                    {getSortedEpisodes().map((episode: IEpisode) => (
                      <EpisodeCardWrapper
                        key={episode.uuid}
                        columns='col-lg-12'
                        isReadonly={false}
                        data={getEpisodeData(episode)}
                        audioEpisodes={getAudioEpisodes()}
                        handleIconClick={handleEpisodeAction}
                        requiredEllipsis={{ title: true }}
                      />
                    ))}
                  </InfiniteScroll>
                </div>
              ) : (
                <p>No Episode Found</p>
              )}
            </div>
          </div>
        </>
      )}

      {isLoading && <FullPageLoader />}

      {isEmbedPopupOpen && (
        <ModalWrapper
          size='lg'
          show={isEmbedPopupOpen}
          handleClose={closeEmbedPopup}
          className='embed-code-popup'
          bodyClass='embed-code-generator'
          body={{
            title: 'Embed Code',
            content: '',
          }}
          button1={{
            children: '',
            onClick: () => {},
          }}
          customElement={(
            <div className='code-box'>
              <EmbedCode
                src={`${DOMAIN_URL}podcast-details/${podcastSlug}`}
                width={900}
                height={600}
              />
            </div>
          )}
          isButton={false}
        />
      )}

      <DeleteModal
        show={openDelete?.isOpen}
        closeModal={handleCloseDeleteModal}
        loading={isDisabled}
        message='Are you sure you want to Delete episode?'
        handleDeleteData={onConfirmDelete}
      />

      <DeleteModal
        show={isDeletePodcast}
        closeModal={setIsDeletePodcast}
        loading={isDisabled}
        message='If you delete this episode, your podcast will be deleted'
        handleDeleteData={onConfirmDeletePodcast}
      />
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  hasAudioPlayer: showAudioPlayer(state),
});

const mapDispatchToProps = {
  closeAudioPlayer: closeAudioPlayerAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PodcastDetailPage);
