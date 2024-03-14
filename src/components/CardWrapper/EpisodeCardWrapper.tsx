import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import IconButtonWrapper from '../IconButtonWrapper';
import {
  getDate,
  getHost,
  getInTitleCase,
  getLocalStorage,
  getMinutesFromSeconds,
  getTitle,
  showToastMessage,
} from '../../utils';
import {
  setAudioPlayerAction,
  playAudioTrackAction,
  pauseAudioTrackAction,
} from '../../redux/actions/audioPlayer';
import {
  getActiveEpisode,
  getTrackStatus,
  showAudioPlayer,
} from '../../redux/selectors/audioPlayer';

import SvgIcons from '../../assets/svg/SvgIcons';
import PlayIcon from '../../assets/svg/PlayIcon';

import { ITag } from '../../types/podcaster';
import { IAudioEpisode, IEpisodeCard } from '../../types';
import { IState } from '../../redux/types';
import rightSideLogin from '../../assets/images/rightSideLogin.svg';
import './episode-card-wrapper.scss';
import { likeEpisode } from '../../services/listener/EpisodeDetails';
import { APP_HOST, TOASTER_STATUS } from '../../constant';
import TooltipWrapper from '../Tooltip/TooltipWrapper';
import MenuIcon from '../../assets/svg/MenuIcon';
import ActionMenuWrapper from '../Dropdown/ActionMenuWrapper';
import { episodeActionMenuItems } from '../../constant/table';

interface IRequiredToolTip {
  title: boolean;
}

interface IProps {
  columns: string;
  isReadonly?: boolean;
  data: IEpisodeCard;
  audioEpisodes: IAudioEpisode[];
  setAudioPlayer: (
    episodes: IAudioEpisode[],
    activeEpisodeId: string,
    isOpen: boolean
  ) => void;
  isPlayTrack: boolean;
  activeAudioEpisode: IAudioEpisode | undefined;
  isAudioPlayer: boolean;
  playTrack: () => void;
  pauseTrack: () => void;
  handleIconClick?: (
    type: string,
    episodeId: string,
    episodeUrl?: string
  ) => void;
  isListener?: boolean;
  showActionButton?: boolean;
  requiredEllipsis?: IRequiredToolTip;
}

const EpisodeCardWrapper: FC<IProps> = ({
  columns,
  isReadonly,
  isListener,
  data,
  audioEpisodes,
  setAudioPlayer,
  isPlayTrack,
  activeAudioEpisode,
  isAudioPlayer,
  playTrack,
  pauseTrack,
  handleIconClick,
  showActionButton,
  requiredEllipsis,
}) => {
  const navigate = useNavigate();
  const { podcastSlug } = useParams();
  const [isLiked, setIsLiked] = useState<boolean>(data.likedEpisode || false);
  const [likeCount, setLikeCount] = useState<number>(
    data?.episodeLikeViewCount?.likeCount || 0,
  );
  const isAuthenticated = getLocalStorage('accessToken');
  const handleLike = (liked: boolean, count: number) => {
    setIsLiked(liked);
    setLikeCount(count);
  };

  const handleClick = (id: string) => {
    if (isAudioPlayer && activeAudioEpisode?.uuid === id) {
      if (isPlayTrack) {
        pauseTrack();
      } else {
        playTrack();
      }
    } else {
      setAudioPlayer(audioEpisodes, id, true);
      playTrack();
    }
  };

  const onIconClick = (episodeId: string, episodeUrl?: string) => {
    if (isAuthenticated) {
      if (handleIconClick) {
        handleIconClick('', episodeId, episodeUrl);
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

  const handleAction = (type: string, id: string) => {
    if (handleIconClick) {
      handleIconClick(type, id);
    }
  };

  return (
    <div className='row'>
      <div className={columns}>
        <div className='episode-card-container'>
          <div className='episode-card with-view d-flex flex-row'>
            {/* eslint-disable-next-line */}
            <div
              className={`me-3 ${isListener ? 'cursor-pointer' : ''}`}
              onClick={() => {
                if (isListener) {
                  navigate(`/podcast-details/${podcastSlug}/${data?.id}`);
                }
              }}
            >
              <img
                src={
                  data.thumbnailUrl && data.thumbnailUrl !== ''
                    ? data.thumbnailUrl
                    : rightSideLogin
                }
                alt='episode-thumbnail'
                className='episode-img'
              />
            </div>
            <div className='episode-details-container d-flex justify-content-center flex-column w-100'>
              <div className='d-flex justify-content-between align-items-center episode-details-description gap-3'>
                <div>
                  {/* eslint-disable-next-line */}
                  <h2
                    className={`overflow-ellipsis mb-0 w-100 w-sm-100 episode-name ${
                      isListener ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => {
                      if (isListener) {
                        navigate(`/podcast-details/${podcastSlug}/${data?.id}`);
                      }
                    }}
                  >
                    <TooltipWrapper
                      tooltip={getTitle(data.title)}
                      overlayProps={{ placement: 'top' }}
                    >
                      {!isListener ? `${data?.episodeNo}. ` : null}
                      {requiredEllipsis
                      && Object.keys(requiredEllipsis).includes('title')
                      && data.title.length > 80
                        ? `${getTitle(data.title).slice(0, 80)}...`
                        : getTitle(data.title)}
                    </TooltipWrapper>
                  </h2>
                  <TooltipWrapper
                    tooltip={data.description}
                    overlayProps={{ placement: 'top' }}
                  >
                    <p className='text-break w-100'>{data.description}</p>
                  </TooltipWrapper>
                </div>
                {((getHost() === APP_HOST.PODCASTER && data?.episodeStatus)
                  || showActionButton) && (
                  <div className='d-flex justify-content-center align-items-center gap-3'>
                    {getHost() === APP_HOST.PODCASTER
                      && data?.episodeStatus && (
                        <div
                          className={`status-block status-block-${data?.episodeStatus
                            .replace('ACCEPTED', 'draft')
                            .toLowerCase()}`}
                        >
                          <div
                            className={`${data?.episodeStatus
                              .replace('ACCEPTED', 'draft')
                              .toLowerCase()}`}
                          >
                            <span>&#9679;</span>
                            <div>
                              {getInTitleCase(
                                data?.episodeStatus.replace('ACCEPTED', 'draft'),
                              )}
                            </div>
                          </div>
                        </div>
                    )}
                    {showActionButton && (
                      <div>
                        {isReadonly ? (
                          <IconButtonWrapper
                            IconName={SvgIcons}
                            iconType='download-icon'
                            onClick={() => onIconClick(data?.id, data?.episodeUrl || '')}
                          />
                        ) : (
                          <ActionMenuWrapper
                            MenuIcon={MenuIcon}
                            items={episodeActionMenuItems}
                            slugId={data?.id}
                            id={data?.id}
                            onClick={(type: string) => handleAction(type, data?.id)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className='episode-details'>
                <div className='d-flex align-items-center flex-wrap'>
                  <span className='audio-control-btn'>
                    <IconButtonWrapper
                      IconName={
                        isPlayTrack && data.id === activeAudioEpisode?.uuid
                          ? SvgIcons
                          : PlayIcon
                      }
                      iconType={
                        isPlayTrack && data.id === activeAudioEpisode?.uuid
                          ? 'small-pause-audio'
                          : ''
                      }
                      className={
                        isPlayTrack && data.id === activeAudioEpisode?.uuid
                          ? 'small-pause-audio-icon'
                          : ''
                      }
                      onClick={() => handleClick(data.id)}
                    />
                  </span>
                  <span className='date'>{data.date ? getDate(String(data.date), 'MMM D') : ''}</span>
                  <span className='time views'>
                    {data.duration && getMinutesFromSeconds(data.duration)}
                  </span>
                  {isListener && (
                    <>
                      <span className='time views'>
                        {`${data?.episodeLikeViewCount?.viewCount || 0} Views`}
                      </span>
                      <div className='likes-button'>
                        {/* eslint-disable-next-line */}
                        <span
                          onClick={() => {
                            if (isAuthenticated) {
                              likeEpisode(handleLike, data.id, !isLiked);
                            } else {
                              showToastMessage(
                                TOASTER_STATUS.ERROR,
                                <>
                                  <span className='m-r-10'>
                                    Login Required!
                                    {' '}
                                  </span>
                                  <Link to='/login'>login</Link>
                                </>,
                              );
                            }
                          }}
                        >
                          <SvgIcons
                            iconType={
                              isLiked ? 'liked-btn-icon' : 'like-btn-icon'
                            }
                          />
                        </span>
                        <span>|</span>
                        {`${likeCount || 0} Likes`}
                      </div>
                    </>
                  )}
                  <div className='m-t-24 tags-btn mt-0'>
                    {data.tags?.length > 0
                      && data.tags.map((tag: ITag) => (
                        <span className='badge bg-primary' key={tag.uuid}>
                          {tag.tagName}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

EpisodeCardWrapper.defaultProps = {
  isReadonly: true,
  handleIconClick: () => {},
  isListener: false,
  showActionButton: true,
  requiredEllipsis: undefined,
};

const mapStateToProps = (state: IState) => ({
  isPlayTrack: getTrackStatus(state),
  activeAudioEpisode: getActiveEpisode(state),
  isAudioPlayer: showAudioPlayer(state),
});

const mapDispatchToProps = {
  setAudioPlayer: setAudioPlayerAction,
  playTrack: playAudioTrackAction,
  pauseTrack: pauseAudioTrackAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(EpisodeCardWrapper);
