import React, { FC, useState, useEffect } from 'react';
import AudioMusicTrackCard from '../../../components/CardWrapper/AudioMusicTrackCard';
import SearchInputWrapper from '../../../components/SearchInputWrapper';
import { IMusicItem } from '../../../types';

import '../../../assets/scss/audio-editor.scss';

interface IProps {
  musicList: IMusicItem[] | [];
  onAddMusicTrack: (track: IMusicItem) => void;
  recentlyUsedMusicList: IMusicItem[] | [];
}

const MusicDrawer: FC<IProps> = ({
  musicList,
  onAddMusicTrack,
  recentlyUsedMusicList,
}) => {
  const [items, setItems] = useState<IMusicItem[] | []>([]);
  const [search, setSearch] = useState<string>('');
  const [recentItems, setRecentItems] = useState<IMusicItem[] | []>([]);

  useEffect(() => {
    setItems(musicList);
    setRecentItems(recentlyUsedMusicList);
  }, []);

  useEffect(() => {
    const newMusicList = musicList.filter((item: IMusicItem) => {
      const name = item.name.toLowerCase();
      const type = item.musicType?.toLowerCase();

      return (
        name.includes(search.toLowerCase())
        || type.includes(search.toLowerCase())
      );
    });

    if (search.length === 0) {
      setRecentItems(recentlyUsedMusicList);
    } else {
      setRecentItems([]);
    }
    setItems(newMusicList);
  }, [search]);

  const handleSearch = (value: string) => setSearch(value);

  return (
    <div className='music-drawer-wrapper'>
      <h3>Music</h3>
      <SearchInputWrapper searchValue={search} handleSearch={handleSearch} />
      {recentItems?.length > 0 && (
        <div className='all-music'>
          <p>Recently Used</p>
          {recentItems.map((element: IMusicItem) => (
            <AudioMusicTrackCard
              key={`recent-music-${element.uuid}`}
              name={element.name}
              id={element.uuid}
              url={element.url}
              duration={element.duration}
              coverImage={element.coverImage}
              musicType={element.musicType}
              artistName={element.artistName}
              onClick={onAddMusicTrack}
            />
          ))}
        </div>
      )}

      <div className='all-music'>
        <p>All Music</p>
        {items?.length > 0 ? (
          items.map((element: IMusicItem) => (
            <AudioMusicTrackCard
              key={element.uuid}
              name={element.name}
              id={element.uuid}
              url={element.url}
              duration={element.duration}
              coverImage={element.coverImage}
              musicType={element.musicType}
              artistName={element.artistName}
              onClick={onAddMusicTrack}
            />
          ))
        ) : (
          <p className='zero-item-text'>No Music Track Found</p>
        )}
      </div>
    </div>
  );
};

export default MusicDrawer;
