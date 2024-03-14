import React, {
  Dispatch, SetStateAction, useRef, useState,
} from 'react';
// @ts-ignore
import AudioSpectrum from 'react-audio-spectrum';
import { useMediaQuery } from 'react-responsive';

import SvgIcons from '../../assets/svg/SvgIcons';
import { formatTime } from '../../utils';
import Loader from '../Loader/Loader';

const AudioWave = ({
  link,
  classString,
  color,
  audioLoading,
  setAudioLoading,
}: {
  link: string;
  classString: string;
  audioLoading: boolean;
  setAudioLoading: Dispatch<SetStateAction<boolean>>;
  // eslint-disable-next-line
  color?: string;
}) => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  // State variables
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setTotalDuration] = useState<number>(0);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime } = audioRef.current;
      setCurrentTime(currentTime);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (!audioRef.current.paused) {
        setIsPlay(false);
        audioRef.current.pause();
      } else {
        setIsPlay(true);
        audioRef.current.play();
      }
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setTotalDuration(audioRef.current.duration);
    }
    setAudioLoading(false);
  };

  return (
    <div>
      {audioLoading && (
        <div className='h-100 w-100 position-absolute top-0 d-flex align-items-center justify-content-center'>
          <div className='h-100 d-flex align-items-center'>
            <Loader className='aliceblue-loader' />
          </div>
        </div>
      )}
      <div
        className={`after-before-container ${audioLoading ? 'invisible' : ''}`}
      >
        {/* Display the current time */}
        <div className='time-enhance' style={{ color: color && '#1B0730' }}>
          {/* eslint-disable-next-line */}
          {formatTime(currentTime)} - {formatTime(duration)}
        </div>
        <div className={classString}>
          <div className='h-100 d-flex align-items-center flex-column justify-content-center'>
            <AudioSpectrum
              height={!isNotMobile && 76}
              width={isNotMobile ? 600 : 300}
              audioId={`${color ? 'sound-before' : 'sound'}`}
              capColor='#ffff'
              capHeight={2}
              meterWidth={2}
              meterCount={512}
              meterColor={[
                { stop: 0, color: color ? '#fff' : '#fff' },
                { stop: 0.5, color: color ? '#797BA1' : '#E2F952' },
                { stop: 1, color: color ? '#797BA1' : '#E2F952' },
              ]}
              gap={5}
            />
            <hr
              className={`hr  ${
                isNotMobile ? 'hr-big-screen' : 'm-0 top-0 w-75 '
              }`}
            />
          </div>
        </div>
        {/* eslint-disable-next-line */}
        <audio
          id={`${color ? 'sound-before' : 'sound'}`}
          ref={audioRef}
          crossOrigin='anonymous'
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlay(false)}
          onLoadStart={() => setAudioLoading(true)}
          onLoadedMetadata={onLoadedMetadata}
        >
          <source src={link} type='audio/mp3' />
        </audio>
        <div className='play-pause'>
          {isPlay ? (
            // eslint-disable-next-line
            <span
              className='pause-audio enhance-play-pause'
              onClick={() => handlePlayPause()}
            >
              {color ? (
                <SvgIcons iconType='blue-pause' />
              ) : (
                <SvgIcons iconType='white-pause' />
              )}
            </span>
          ) : (
            // eslint-disable-next-line
            <span
              className='resume-audio enhance-play-pause'
              onClick={() => handlePlayPause()}
            >
              {color ? (
                <SvgIcons iconType='blue-play' />
              ) : (
                <SvgIcons iconType='white-play' />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioWave;
