import { IAudioEpisode } from '../../types';

function getIndexFromEpisodes(episodes: IAudioEpisode[], id: string) {
  return episodes.findIndex((episode: IAudioEpisode) => episode.uuid === id);
}

export const getNextAudio = (episodes: IAudioEpisode[], id: string) => {
  const activeAudioIndex = getIndexFromEpisodes(episodes, id);

  if (activeAudioIndex === episodes.length - 1) {
    return id;
  }

  return episodes[activeAudioIndex + 1].uuid;
};

export const getPrevAudio = (episodes: IAudioEpisode[], id: string) => {
  const activeAudioIndex = getIndexFromEpisodes(episodes, id);

  if (activeAudioIndex === 0) {
    return id;
  }

  return episodes[activeAudioIndex - 1].uuid;
};
