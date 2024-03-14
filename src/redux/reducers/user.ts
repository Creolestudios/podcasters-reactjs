import { UserActions } from '../types/user';
import { IUser } from '../../types';

import {
  ADMIN_LOGIN,
  GET_USER_DETAIL,
  LISTENER_LOGIN,
  PODCASTER_LOGIN,
  SET_AUDIO_EDITOR_EPISODES_COUNT,
  UPDATE_USER_DETAIL,
  USER_LOGOUT,
} from '../constants/user';

const initialState: IUser = {
  email: '',
  roles: [''],
  userProfileCompleted: false,
  userPurchasedPlan: false,
  uuid: '',
  bio: '',
  country: '',
  dateOfBirth: '',
  episodeCount: 0,
  firstName: '',
  gender: '',
  languageCode: null,
  lastName: '',
  monetizedAllPodcasts: false,
  podcastCount: 0,
  profilePhotoUrl: null,
  activePlanUuidAndEndDate: null,
  editorEpisodeCount: 0,
};

// eslint-disable-next-line
const user = (state = initialState, action: UserActions) => {
  switch (action.type) {
    case GET_USER_DETAIL:
    case PODCASTER_LOGIN:
      return {
        ...state,
        ...action.payload,
      };
    case LISTENER_LOGIN:
      return {
        ...state,
        ...action.payload,
      };
    case ADMIN_LOGIN:
      return {
        ...state,
        ...action.payload,
      };
    case UPDATE_USER_DETAIL:
      return {
        ...state,
        ...action.payload,
      };

    case USER_LOGOUT:
      return {
        ...state,
        ...initialState,
      };

    case SET_AUDIO_EDITOR_EPISODES_COUNT:
      return {
        ...state,
        editorEpisodeCount: action.payload,
      };

    default:
      return state;
  }
};

export default user;
