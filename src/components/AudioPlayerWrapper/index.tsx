import React, {
  FC, useState, useEffect, useRef,
} from 'react';

import AudioPlayer from 'react-h5-audio-player';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader';
import IconButtonWrapper from '../IconButtonWrapper';
import {
  getActiveEpisode,
  getTotalEpisodes,
  getTrackStatus,
  showAudioPlayer,
} from '../../redux/selectors/audioPlayer';
import { getCookie, getInTitleCase } from '../../utils';
import {
  closeAudioPlayerAction,
  nextAudioAction,
  prevAudioAction,
  playAudioTrackAction,
  pauseAudioTrackAction,
} from '../../redux/actions/audioPlayer';

import SvgIcons from '../../assets/svg/SvgIcons';
import RemoveAudioIcon from '../../assets/svg/RemoveAudioIcon';
import { IState } from '../../redux/types';
import { IAudioEpisode } from '../../types';

import 'react-h5-audio-player/lib/styles.css';
import './index.scss';
import { episodePlayed } from '../../services/listener/EpisodeDetails';

interface IProps {
  activeEpisode: IAudioEpisode | undefined;
  isOpen: boolean;
  closeAudioPlayer: () => void;
  next: () => void;
  prev: () => void;
  total: number;
  play: () => void;
  pause: () => void;
  isPlayTrack: boolean;
}

const AudioPlayerWrapper: FC<IProps> = ({
  activeEpisode,
  isOpen,
  closeAudioPlayer,
  next,
  prev,
  total,
  play,
  pause,
  isPlayTrack,
}) => {
  const audioPlayerRef: any = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const userCookieId = getCookie('userCookieId') ?? '0'; // if we are not getting value in that case we are passing 0 in view count api for updating the count

  useEffect(() => {
    if (isOpen && isPlayTrack) {
      setIsLoading(false);
      setIsPlay(true);
      play();
      audioPlayerRef.current.audio.current.play();
    } else if (isOpen && !isPlayTrack) {
      setIsPlay(false);
      pause();
      audioPlayerRef.current.audio.current.pause();
    }
  }, [activeEpisode, isPlayTrack]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setIsPlay(true);
      play();
    }
  }, []);

  const handleLoading = () => setIsLoading(false);

  const handleListen = (e: any) => {
    const { target } = e || {};
    const { currentTime } = target || {};
    if (target && currentTime < (activeEpisode?.playedDuration || 0)) {
      // Seek to the desired starting time
      target.currentTime = activeEpisode?.playedDuration;
    }

    setProgress(Math.floor(currentTime));
  };

  const getActiveAudioButton = () => {
    if (isPlay) {
      return (
        <IconButtonWrapper
          IconName={SvgIcons}
          iconType='pause-audio'
          onClick={() => {
            setIsPlay(false);
            pause();
            episodePlayed(activeEpisode?.uuid || '', progress, parseInt(userCookieId, 10));
          }}
        />
      );
    }
    return (
      <IconButtonWrapper
        IconName={SvgIcons}
        iconType='play-audio'
        onClick={() => {
          setIsPlay(true);
          play();
        }}
      />
    );
  };

  const onClose = () => {
    closeAudioPlayer();
    episodePlayed(activeEpisode?.uuid || '', progress, parseInt(userCookieId, 10));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className='play-fixed-box'>
      {isLoading ? (
        <div className='aliceblue-loader p-5'>
          <Loader />
        </div>
      ) : (
        <>
          <IconButtonWrapper
            IconName={RemoveAudioIcon}
            onClick={onClose}
            className='close-audioPlayer'
          />
          <div className='row'>
            <div className='col-xl-11 text-white music-player'>
              <AudioPlayer
                ref={audioPlayerRef}
                src={activeEpisode?.url ?? activeEpisode?.episodeUrl ?? ''}
                autoPlay={isPlay}
                autoPlayAfterSrcChange={false}
                preload='auto'
                loop={false}
                muted={false}
                header={getInTitleCase(activeEpisode?.name ?? '')}
                customIcons={{
                  play: getActiveAudioButton(),
                  pause: getActiveAudioButton(),
                  forward: (
                    <IconButtonWrapper
                      IconName={SvgIcons}
                      iconType='next-audio'
                      onClick={next}
                      isDisabled={total === activeEpisode?.number}
                    />
                  ),
                  rewind: (
                    <IconButtonWrapper
                      IconName={SvgIcons}
                      iconType='prev-audio'
                      onClick={prev}
                      isDisabled={activeEpisode?.number === 1}
                    />
                  ),
                }}
                onLoadedData={handleLoading}
                onListen={handleListen}
                onEnded={() => {
                  pause();
                  episodePlayed(activeEpisode?.uuid || '', progress, parseInt(userCookieId, 10));
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  activeEpisode: getActiveEpisode(state),
  isOpen: showAudioPlayer(state),
  total: getTotalEpisodes(state),
  isPlayTrack: getTrackStatus(state),
});

const mapDispatchToProps = {
  closeAudioPlayer: closeAudioPlayerAction,
  next: nextAudioAction,
  prev: prevAudioAction,
  play: playAudioTrackAction,
  pause: pauseAudioTrackAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayerWrapper);
