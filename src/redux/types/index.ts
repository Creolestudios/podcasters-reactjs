import { IAudioPlayer, IUser, IAudioEditor } from '../../types';
import { IPodcastHomeState, IPodcastSearchState } from './listener';
import { IPodcastState } from './podcast';

export interface IPodcaster {
  podcast: IPodcastState;
  audioEditor: IAudioEditor;
}
export interface IListener {
  homePageData: IPodcastHomeState;
  searchPodcast: IPodcastSearchState;
}
export interface IState {
  user: IUser;
  podcaster: IPodcaster;
  audioPlayer: IAudioPlayer;
  listener: IListener;
}
