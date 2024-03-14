import React, { FC } from 'react';
import { getInTitleCase } from '../../utils';
import defaultPodcastThumbnail from '../../assets/images/defaultPodcastThumbnail.png';

import './audio-music-track-card.scss';
import { IMusicItem } from '../../types';

interface IProps {
  id: string;
  name: string;
  url: string;
  duration: number;
  coverImage: null | string;
  musicType: string;
  artistName: string | null;
  onClick: (item: IMusicItem) => void;
}

const AudioMusicTrackCard: FC<IProps> = ({
  id,
  name,
  url,
  duration,
  coverImage,
  musicType,
  artistName,
  onClick,
}) => (
  <button
    className='audio-music-track-card-wrapper'
    type='button'
    key={id}
    onClick={() => onClick({
      uuid: id,
      url,
      name,
      duration,
      musicType,
      coverImage,
      artistName,
    })}
  >
    <img
      src={coverImage || defaultPodcastThumbnail}
      alt={name}
      className='img-fluid rounded'
    />
    <div className='right-section'>
      <p className='title m-0'>{name}</p>
      <p className='other-details m-0'>
        {duration}
        {artistName && <span>{artistName}</span>}
        <span>{getInTitleCase(musicType)}</span>
      </p>
    </div>
  </button>
);

export default AudioMusicTrackCard;
