import {
  getPodcastsFilter,
  getPodcastByPodcaster,
  deletePodcast,
} from '../../../services/podcaster/Podcast';
import { showToastMessage } from '../../../utils';

import {
  GET_PODCASTS_BY_PODCASTER,
  GET_PODCASTS_FILTER,
  RESET_PODCASTS_FILTER,
  SET_PAGE,
  SET_PODCASTS_FILTER,
  SET_PODCAST_STATUS,
  SET_SEARCH_QUERY,
  RESET_PAGE,
} from '../../constants/podcaster/podcast';
import { TOASTER_STATUS } from '../../../constant';
import { PodcastDispatch } from '../../types/podcast';
import { IPodcastsFilterParams } from '../../../types/podcaster';
import { INestedSelectItem } from '../../../components/Dropdown/NestedSelectWrapper';

export const getPodcastsByPodcasterAction = (
  search: string,
  page: number,
  size: number,
  sortColumnId: string,
  sortDirection: string,
  handleLoading: (value: boolean) => void,
  filterParams: IPodcastsFilterParams,
) => async (dispatch: PodcastDispatch) => {
  try {
    const response = await getPodcastByPodcaster(
      search,
      page,
      size,
      sortColumnId,
      sortDirection,
      filterParams,
    );
    if (response.data.success) {
      dispatch({
        type: GET_PODCASTS_BY_PODCASTER,
        payload: {
          podcasts: response.data.result.data,
          total: response.data.result.recordsTotal,
        },
      });
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  } finally {
    handleLoading(false);
  }
};

export function setSearchQueryAction(query: string) {
  return async (dispatch: PodcastDispatch) => dispatch({
    type: SET_SEARCH_QUERY,
    payload: query,
  });
}

export function setPageAction(page: number) {
  return async (dispatch: PodcastDispatch) => dispatch({
    type: SET_PAGE,
    payload: page,
  });
}

export const setPodcastStatusAction = (
  search: string,
  page: number,
  size: number,
  sortColumnId: string,
  sortDirection: string,
  handleLoading: (value: boolean) => void,
  filterParams: IPodcastsFilterParams,
) => async (dispatch: PodcastDispatch) => {
  try {
    await dispatch(
      getPodcastsByPodcasterAction(
        search,
        page,
        size,
        sortColumnId,
        sortDirection,
        handleLoading,
        filterParams,
      ),
    );

    // Dispatch SET_PODCAST_STATUS after getPodcastsByPodcasterAction is completed
    dispatch({
      type: SET_PODCAST_STATUS,
    });
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  }
};

export const getPodcastsFilterAction = () => async (dispatch: PodcastDispatch) => {
  try {
    const response = await getPodcastsFilter();

    if (response.data.success) {
      dispatch({
        type: GET_PODCASTS_FILTER,
        payload: response.data.result,
      });
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  }
};

export function setPodcastsFilterAction(
  value: string | boolean,
  parentItem: INestedSelectItem,
) {
  return async (dispatch: PodcastDispatch) => dispatch({
    type: SET_PODCASTS_FILTER,
    payload: { value, parentItem },
  });
}

export const resetPodcastsFilterAction = () => async (dispatch: PodcastDispatch) => dispatch({
  type: RESET_PODCASTS_FILTER,
});

export const deletePodcastAction = (
  id: string,
  search: string,
  page: number,
  size: number,
  sortColumnId: string,
  sortDirection: string,
  handleLoading: (value: boolean) => void,
  filterParams: IPodcastsFilterParams,
) => async (dispatch: PodcastDispatch) => {
  try {
    const response = await deletePodcast(id);
    if (response.data.success) {
      dispatch(
        getPodcastsByPodcasterAction(
          search,
          page,
          size,
          sortColumnId,
          sortDirection,
          handleLoading,
          filterParams,
        ),
      );
      showToastMessage(TOASTER_STATUS.SUCCESS, response.data.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  }
};

export function resetPageAction() {
  return async (dispatch: PodcastDispatch) => dispatch({
    type: RESET_PAGE,
  });
}
