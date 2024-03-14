import React, { useEffect, useState } from 'react';

import CopyToClipboard from 'react-copy-to-clipboard';
import { Tab, Tabs } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FacebookShareButton } from 'react-share';
import ProfilePic from '../../../assets/images/profile-pic.svg';
import LeftArrow from '../../../assets/svg/LeftArrow';
import SvgIcons from '../../../assets/svg/SvgIcons';
import {
  addComment,
  episodeDownload,
  getComments,
  getEpisodeDetails,
  getNextEpisodes,
  likeEpisode,
  reportComment,
  deleteComment,
} from '../../../services/listener/EpisodeDetails';
import { IEpisode, IEpisodeDetails } from '../../../types/listener';
import EpisodeCardWrapper from '../../../components/CardWrapper/EpisodeCardWrapper';
import {
  downloadAudioFile,
  getLocalStorage,
  showToastMessage,
  getTimeDifference,
  validateHtmlTag,
} from '../../../utils';
import { TOASTER_STATUS } from '../../../constant';
import '../../../assets/scss/podcast-detail.scss';
import '../../../assets/scss/episode-details.scss';
import FormGroupWrapper from '../../../components/form/FormGroupWrapper';
import { IState } from '../../../redux/types';
import { getUser } from '../../../redux/selectors/user';
import { IOpen, IUser } from '../../../types';
import ButtonWrapper from '../../../components/form/ButtonWrapper';
import IconButtonWrapper from '../../../components/IconButtonWrapper';
import { CLOUDINARY_URL, DOMAIN_URL } from '../../../clientConfig';
import Loader from '../../../components/Loader/Loader';
import SeoHelmet from '../../../components/SeoHelmet/SeoHelmet';
import PopupButtonWrapper from '../../../components/Popup/PopupButtonWrapper';
import TooltipWrapper from '../../../components/Tooltip/TooltipWrapper';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import ActionMenuWrapper from '../../../components/Dropdown/ActionMenuWrapper';
import MenuIcon from '../../../assets/svg/MenuIcon';
import { episodeCommentActionMenuItems } from '../../../constant/table';
import DeleteModal from '../../../components/Modal/DeleteModal';

interface IProps {
  user: IUser;
}

const EpisodeDetail: React.FC<IProps> = ({ user }) => {
  const navigate = useNavigate();
  const { podcastSlug, episodeName, episodeUuid } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [episodeDetails, setEpisodeDetails] = useState<any>({});
  const [comment, setComment] = useState<string>('');
  const [commentsDetail, setCommentsDetails] = useState<any>({});
  const [isAllCommentVisible, setIsAllCommentVisible] = useState<boolean>(true);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isReporting, setIsReporting] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [nextEpisodesDetails, setNextEpisodesDetails] = useState<any>(null);
  const isAuthenticated = getLocalStorage('accessToken');
  const [isCommentBtnDisabled, setIsCommentBtnDisabled] = useState<boolean>(false);
  const [isAdsAvailable, setIsAdsAvailable] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<IOpen>({
    isOpen: false,
    id: null,
  });
  const [isActionMenuShow, setIsActionMenuShow] = useState<boolean>(false);
  const handleDisable = (value: boolean) => setIsDisabled(value);
  const handleCloseDeleteModal = (value: boolean) => setOpenDelete({ isOpen: value, id: null });

  const handleLoading = (value: boolean) => setIsLoading(value);
  const checkActionMenuIsOpen = (value: boolean) => setIsActionMenuShow(value);

  const handleEpisodeDetail = (details: any) => {
    setEpisodeDetails(details);
    setIsLiked(details?.episode?.likedEpisode);
    setLikeCount(details?.episodeLikeViewCount?.likeCount);
    setCommentsDetails({
      recordsFiltered: details?.commentList?.length,
      recordsTotal: details?.totalComments,
      data: details?.commentList,
    });
  };

  const handleLike = (liked: boolean, count: number) => {
    setIsLiked(liked);
    setLikeCount(count);
  };

  const removeCommentText = () => setComment('');
  const handleCommnentDisabled = (value: boolean) => setIsCommentBtnDisabled(value);

  const handleCommentDetail = (comments: IEpisodeDetails) => setCommentsDetails(comments);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hideViewAllComment, setHideViewAllComment] = useState(true);
  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  const handlenextEpisodesDetails = (details: any) => {
    setNextEpisodesDetails(details);
  };

  const doNextGetEpisodes = (page: number, size: number) => {
    getNextEpisodes(handlenextEpisodesDetails, episodeDetails?.episode?.uuid, page, size);
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
    episodeUrl: episode.episodeUrl,
    episodeLikeViewCount: episode?.episodeLikeViewCount,
    likedEpisode: episode?.likedEpisode,
  });

  const getAudioEpisodes = () => episodeDetails.nextEpisodeList.map((episode: IEpisode) => ({
    name: episode.name,
    url: episode.episodeUrl,
    podcastId: episode.podcastId,
    number: episode.episodeNo,
    duration: episode.duration,
    uuid: episode.uuid,
  }));

  const getSortedEpisodes = () => {
    const { nextEpisodeList } = episodeDetails;

    return nextEpisodeList.sort((prev: IEpisode, next: IEpisode) => {
      if (prev.episodeNo && next.episodeNo) {
        return prev.episodeNo - next.episodeNo;
      }
      return prev.episodeNo ?? 0;
    });
  };

  const handleDownloadAudio = async (episodeId: string, episodeUrl: string) => {
    const episode = getSortedEpisodes().find((episode: any) => episode?.uuid === episodeId);
    const episodeName = episode?.name || episodeDetails?.episode.name || '';
    if (isAuthenticated) {
      if (episodeUrl) {
        try {
          const fileFormat = episodeUrl.split('.').pop() || '';
          downloadAudioFile(fileFormat, episodeUrl, episodeName);

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

  const doAddComment = (episodeUuid: string, commentMessage: string) => {
    if (commentMessage) {
      if (isAuthenticated) {
        addComment(
          handleCommentDetail,
          removeCommentText,
          handleCommnentDisabled,
          episodeUuid,
          commentMessage,
        );
      } else {
        showToastMessage(
          TOASTER_STATUS.ERROR,
          <>
            <span className='m-r-10'>Login Required! </span>
            <Link to='/login'>login</Link>
          </>,
        );
      }
    }
  };

  const onDeleteComment = (id: string) => {
    setOpenDelete({
      isOpen: true,
      id,
    });
  };

  const doGetComments = () => {
    getComments(
      handleCommentDetail,
      episodeDetails?.episode?.uuid,
      0,
      commentsDetail?.recordsFiltered || 0,
    );
  };
  const onConfirmDeleteComment = () => {
    handleDisable(true);
    deleteComment(openDelete?.id ?? '', handleDisable, doGetComments);
    setOpenDelete({
      isOpen: false,
      id: null,
    });
  };

  const handleAction = (type: string, id: string) => {
    if (type === 'report') {
      reportComment(id, handleCommentDetail, episodeUuid ?? '', (value: boolean) => setIsReporting(value));
    }
    if (type === 'delete') {
      onDeleteComment(id);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const value = e.currentTarget?.value?.trim();
    if (key === 'Enter' && value && value?.length <= 255 && !isCommentBtnDisabled) {
      if (validateHtmlTag(value)) {
        showToastMessage(TOASTER_STATUS.ERROR, 'For security reasons, HTML tags are not allowed');
      } else {
        handleCommnentDisabled(true);
        doAddComment(episodeDetails?.episode?.uuid, value);
      }
    }
  };

  const fetchMoreComment = () => {
    if (!hideViewAllComment) {
      getComments(
        handleCommentDetail,
        episodeDetails?.episode?.uuid,
        0,
        (commentsDetail?.recordsFiltered || 0) + 10,
      );
    }
  };

  useEffect(() => {
    setEpisodeDetails({
      ...episodeDetails,
      nextEpisodeList: nextEpisodesDetails?.data,
    });
  }, [nextEpisodesDetails]);

  useEffect(() => {
    handleLoading(true);
    getEpisodeDetails(handleEpisodeDetail, handleLoading, episodeUuid || '');
  }, [episodeUuid]);

  return isLoading ? (
    <FullPageLoader isScreenExist />
  ) : (
    <>
      <SeoHelmet
        displayTitle={episodeDetails?.episode?.name}
        metaDescription={episodeDetails?.episode?.description}
        metaUrl={`${DOMAIN_URL}podcast-details/${podcastSlug}/${episodeName}`}
        metaImageUrl={episodeDetails?.episode?.episodeCoverImage}
      />

      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='d-md-flex block align-items-center justify-content-between main-div'>
              <div className='main-title d-flex align-items-center max-w-title'>
                {/* eslint-disable-next-line */}
                <span className='me-4 d-flex forward-btn' onClick={() => navigate(-1)}>
                  <LeftArrow />
                </span>
                <TooltipWrapper
                  tooltip={episodeDetails?.episode?.name}
                  overlayProps={{ placement: 'bottom' }}
                >
                  <p className='m-0'>{episodeDetails?.episode?.name}</p>
                </TooltipWrapper>
              </div>
              <div className='d-flex flex-wrap align-items-center justify-content-end like-share d-none d-md-flex'>
                <IconButtonWrapper
                  IconName={SvgIcons}
                  iconType='download-icon'
                  onClick={() => {
                    handleDownloadAudio(episodeUuid || '', episodeDetails?.episode?.episodeUrl);
                  }}
                />

                <PopupButtonWrapper
                  isIcon
                  IconName={SvgIcons}
                  iconType='share-icon'
                  popupElement={(
                    <div>
                      <FacebookShareButton
                        url={`${DOMAIN_URL}podcast-details/${podcastSlug}/${episodeUuid}`}
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
                            `${DOMAIN_URL}podcast-details/${podcastSlug}/${episodeUuid}`,
                          );
                          window.open(
                            `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                            '_blank',
                          );
                        }}
                      />

                      <CopyToClipboard
                        text={`${DOMAIN_URL}podcast-details/${podcastSlug}/${episodeUuid}`}
                        onCopy={() => {
                          showToastMessage(TOASTER_STATUS.SUCCESS, 'Link Copied Successfully');
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
                src={episodeDetails?.episode?.episodeCoverImage}
                alt='episode-banner'
                className='img-fluid'
              />
            </div>
          </div>
        </div>

        <div className='row'>
          <div className={isAdsAvailable ? 'col-lg-8' : 'col-lg-12'}>
            <div className='listener-episodes'>
              <div className='pb-4 listerner-star'>
                <div className='mb-3 mt-3 mt-xl-0 d-flex justify-content-sm-between justify-content-center align-items-center flex-wrap'>
                  <div>
                    <span className='time'>{episodeDetails?.episode?.categoryName}</span>
                    <span className='time'>{episodeDetails?.episode?.country}</span>
                    <span className='time'>{episodeDetails?.episode?.language}</span>
                  </div>

                  <div className='with-view d-flex align-items-center flex-wrap'>
                    <span className='stream-views'>
                      {episodeDetails?.episode?.episodeLikeViewCount?.viewCount || 0}
                      {' '}
                      Views
                    </span>
                    <div className='likes-button'>
                      {/* eslint-disable-next-line */}
                      <span
                        className='cursor-pointer'
                        onClick={() => {
                          if (isAuthenticated) {
                            likeEpisode(handleLike, episodeDetails?.episode?.uuid, !isLiked);
                          } else {
                            showToastMessage(
                              TOASTER_STATUS.ERROR,
                              <>
                                <span className='m-r-10'>Login Required! </span>
                                <Link to='/login'>login</Link>
                              </>,
                            );
                          }
                        }}
                      >
                        <SvgIcons iconType={isLiked ? 'liked-btn-icon' : 'like-btn-icon'} />
                      </span>
                      <span>|</span>
                      {likeCount || 0}
                      {' '}
                      Likes
                    </div>
                    <div className='like-share m-0 d-flex d-md-none'>
                      <div>
                        <IconButtonWrapper
                          IconName={SvgIcons}
                          iconType='download-icon'
                          onClick={() => {
                            handleDownloadAudio(
                              episodeUuid || '',
                              episodeDetails?.episode?.episodeUrl,
                            );
                          }}
                        />
                      </div>
                      <div>
                        <PopupButtonWrapper
                          isIcon
                          IconName={SvgIcons}
                          iconType='share-icon'
                          popupElement={(
                            <div>
                              <FacebookShareButton
                                url={`${DOMAIN_URL}podcast-details/${podcastSlug}/${episodeUuid}`}
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
                                    `${DOMAIN_URL}podcast-details/${podcastSlug}/${episodeUuid}`,
                                  );
                                  window.open(
                                    `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                                    '_blank',
                                  );
                                }}
                              />

                              <CopyToClipboard
                                text={`${DOMAIN_URL}podcast-details/${podcastSlug}/${episodeUuid}`}
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
                <div className={`text-container ${isExpanded ? 'expanded' : ''}`}>
                  <p className='mb-2 two-line-p'>{episodeDetails?.episode?.description}</p>
                  {episodeDetails?.episode?.description?.length > 220 && (
                    // eslint-disable-next-line
                    <span className='see-more-btn' onClick={toggleText}>
                      {isExpanded ? 'See Less' : 'See More'}
                    </span>
                  )}
                </div>
              </div>

              <div className='d-flex flex-column'>
                <div className='order-2 order-md-1'>
                  <div className='comments-block'>
                    <p className='m-0'>Comments</p>
                    <div className='comments-user d-flex'>
                      <div>
                        <img
                          src={user?.profilePhotoUrl || ProfilePic}
                          className='img-fluid d-block mx-auto'
                          alt=''
                        />
                      </div>
                      <div className='position-relative w-100'>
                        <SvgIcons iconType='comment-icon' />
                        <FormGroupWrapper
                          type='text'
                          placeholder='What’s your mind?'
                          label=''
                          name='comment'
                          className='comment-box'
                          onChange={(e: any) => {
                            setComment(e?.target?.value);
                          }}
                          onKeyDown={onKeyDown}
                          value={comment}
                          max={255}
                          error={
                            comment?.trim().length > 255 ? 'Maximum 255 characters allowed' : ''
                          }
                        />
                        <IconButtonWrapper
                          IconName={SvgIcons}
                          iconType='msg-sent-icon'
                          onClick={() => {
                            const value = comment?.trim();
                            if (value) {
                              if (validateHtmlTag(value)) {
                                showToastMessage(
                                  TOASTER_STATUS.ERROR,
                                  'For security reasons, HTML tags are not allowed',
                                );
                              } else {
                                handleCommnentDisabled(true);
                                doAddComment(episodeDetails?.episode?.uuid, value);
                              }
                            }
                          }}
                          className='msg-sent-icon'
                          isDisabled={
                            !comment?.trim().length
                            || isCommentBtnDisabled
                            || comment?.trim().length > 255
                          }
                        />
                      </div>
                    </div>
                    {commentsDetail?.recordsFiltered > 0 && (
                      <>
                        {/* eslint-disable-next-line */}
                        <div
                          className='all-comments mb-2 cursor-pointer'
                          onClick={() => setIsAllCommentVisible(!isAllCommentVisible)}
                        >
                          <span className='me-2'> All Comments </span>
                          <span className='all-commnet-arrow'>
                            <SvgIcons iconType='arrow-down-icon' />
                          </span>
                        </div>
                      </>
                    )}

                    {commentsDetail?.recordsFiltered > 0 && (
                      <div
                        className={`comments-container ${!isAllCommentVisible ? 'd-none' : ''} ${
                          isActionMenuShow && commentsDetail?.data?.length === 1
                            ? 'single-item'
                            : ''
                        }`}
                      >
                        <div id='infinite-scrollbar' className='w-100'>
                          <InfiniteScroll
                            dataLength={commentsDetail?.recordsFiltered}
                            next={() => fetchMoreComment()}
                            hasMore={
                              !hideViewAllComment
                              && commentsDetail?.recordsTotal > commentsDetail?.recordsFiltered
                            }
                            loader={<Loader />}
                          >
                            {commentsDetail?.data?.map((comment: any, index: number) => (
                              <div
                                className={`all-comments d-flex mb-4 ${
                                  index !== 0
                                  && index === commentsDetail.data.length - 1
                                  && 'last-element'
                                }`}
                              >
                                <div>
                                  <img
                                    src={
                                      comment?.userProfilePhotoUrl
                                        ? `${CLOUDINARY_URL}${comment?.userProfilePhotoUrl}`
                                        : `${DOMAIN_URL}static/media/profile-pic.292a0c0081b427d0b15a14919e46f48f.svg`
                                    }
                                    alt=''
                                  />
                                </div>
                                <div className='all-details'>
                                  <div className=''>
                                    <span>{`${comment?.userFirstName} ${comment?.userLastName}`}</span>
                                    {' '}
                                    {getTimeDifference(comment?.createdDate)}
                                  </div>
                                  <div className='comment-text'>{comment?.commentMessage}</div>
                                  <ActionMenuWrapper
                                    MenuIcon={MenuIcon}
                                    items={episodeCommentActionMenuItems}
                                    slugId={comment?.commentUuid}
                                    id={comment?.commentUuid}
                                    onClick={(type: string) => {
                                      handleAction(type, comment?.commentUuid);
                                    }}
                                    disabled={{ report: comment?.reportedByCurrentUser }}
                                    hidden={{
                                      delete: comment?.commentBy !== user?.uuid,
                                    }}
                                    hasDivider={comment?.commentBy === user?.uuid}
                                    checkActionMenuIsOpen={checkActionMenuIsOpen}
                                  />
                                </div>
                              </div>
                            ))}
                          </InfiniteScroll>
                        </div>
                        {hideViewAllComment && commentsDetail?.recordsTotal > 2 && (
                          /* eslint-disable-next-line */
                          <div
                            className='view-all-comments cursor-pointer'
                            onClick={() => {
                              setHideViewAllComment(false);
                              getComments(
                                handleCommentDetail,
                                episodeDetails?.episode?.uuid,
                                0,
                                (commentsDetail?.recordsFiltered || 0) + 10,
                              );
                            }}
                          >
                            View All Comments
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {episodeDetails?.transcript?.summary
                  && episodeDetails?.transcript?.transcriptData ? (
                    <div className='my-4'>
                      <div className='row'>
                        <div className='col-lg-12'>
                          <div className='tabs stream-epicode-tab'>
                            <Tabs
                              variant='pills'
                              defaultActiveKey='summary'
                              id='uncontrolled-tab-example'
                              className='mb-3'
                            >
                              <Tab eventKey='summary' title='Summary'>
                                <p className='m-0'>{episodeDetails?.transcript?.summary}</p>
                              </Tab>
                              <Tab eventKey='transcript' title='Transcript'>
                                <p className='m-0'>{episodeDetails?.transcript?.transcriptData}</p>
                              </Tab>
                            </Tabs>
                          </div>
                        </div>
                      </div>
                    </div>
                    ) : null}
                </div>

                <div className='order-1 order-md-2'>
                  <div className='d-flex align-items-center flex-wrap justify-content-between episodes-list listener-b-title pt-0'>
                    <div className='episodes'>Next Episodes</div>
                  </div>
                  {episodeDetails?.nextEpisodeList?.length > 0 ? (
                    <div id='infinite-scrollbar'>
                      <InfiniteScroll
                        dataLength={episodeDetails?.nextEpisodeList?.length}
                        next={() => {
                          doNextGetEpisodes(0, episodeDetails.nextEpisodeList.length + 10);
                        }}
                        hasMore={
                          episodeDetails?.totalNextEpisodes > episodeDetails.nextEpisodeList.length
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
            </div>
          </div>
          {/* <div className='col-lg-4'>
            <div className='text-center mb-4'>
              <img src={PortraitLargeBanner} alt='ads-banner' className='img-fluid' />
            </div>

            <div className='text-center'>
              <img src={LandscapeSmallBanner} alt='ads-banner' className='img-fluid' />
            </div>
          </div> */}
        </div>
        <DeleteModal
          show={openDelete?.isOpen}
          closeModal={handleCloseDeleteModal}
          loading={isDisabled}
          message='Are you sure you want to Delete comment?'
          handleDeleteData={onConfirmDeleteComment}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state: IState) => ({
  user: getUser(state),
});

export default connect(mapStateToProps, null)(EpisodeDetail);
