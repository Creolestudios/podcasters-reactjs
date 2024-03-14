import { createSelector } from 'reselect';

import { IState } from '../types';
import { IUser } from '../../types';

export const getUser = (state: IState) => state.user;

export const getUserSubscribedPlanId = createSelector(
  getUser,
  (user: IUser) => user.activePlanUuidAndEndDate?.activePlanUuid,
);

export const getEditorEpisodeCount = createSelector(
  getUser,
  (user: IUser) => user.editorEpisodeCount,
);
