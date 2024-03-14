import { ThunkDispatch } from 'redux-thunk';

import {
  ADMIN_LOGIN,
  ADVERTISER_LOGIN,
  GET_USER_DETAIL,
  LISTENER_LOGIN,
  PODCASTER_LOGIN,
  SET_AUDIO_EDITOR_EPISODES_COUNT,
  UPDATE_USER_DETAIL,
  USER_LOGOUT,
} from '../constants/user';

import { IUser } from '../../types';
import { IState } from '.';

export type podcasterLoginAction = {
  type: typeof PODCASTER_LOGIN;
  payload: IUser;
};

export type listenerLoginAction = {
  type: typeof LISTENER_LOGIN;
  payload: IUser;
};

export type adminLoginAction = {
  type: typeof ADMIN_LOGIN;
  payload: IUser;
};

export type advertiserLoginAction = {
  type: typeof ADVERTISER_LOGIN;
  payload: IUser;
};

export type getUserDetailAction = {
  type: typeof GET_USER_DETAIL;
  payload: IUser;
};

export type updateUserDetailAction = {
  type: typeof UPDATE_USER_DETAIL;
  payload: IUser;
};

export type userLogoutAction = {
  type: typeof USER_LOGOUT;
};

export type setAudioEditorEpisodesCountAction = {
  type: typeof SET_AUDIO_EDITOR_EPISODES_COUNT;
  payload: number;
};

export type UserActions =
  | podcasterLoginAction
  | advertiserLoginAction
  | getUserDetailAction
  | updateUserDetailAction
  | listenerLoginAction
  | adminLoginAction
  | userLogoutAction
  | setAudioEditorEpisodesCountAction;

export type UserDispatch = ThunkDispatch<IUser, void, UserActions>;
export type UserGetState = () => IState;
