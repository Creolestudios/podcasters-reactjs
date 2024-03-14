import AxiosClient from '../AxiosClient';
import {
  EPISODE_API_ROUTES,
  PODCASTER_HOME_API_ROUTES as PODCASTER_HOME,
  PODCAST_API_ROUTES,
  PODCASTER_PODCAST_DETAIL_API_ROUTES as PODCAST_DETAIL,
} from '../../constant/apiRoute';
import { uploadEpisodeImages } from './Episode';
import {
  IPodcast,
  IPodcastForm,
} from '../../types/podcastInterface';

import { IPodcastOptions, IPodcastsFilterParams } from '../../types/podcaster';
import {
  getDateOrTimeFromStatus,
  getFileExtension,
  getScheduledDateTime,
  getUuidFromOptionName,
  showToastMessage,
} from '../../utils';
import { PODCAST_STATUS, TOASTER_STATUS } from '../../constant';
import { uploadAudioFile } from '../../components/Action/Image&AudioUpload';
import { ITag } from '../../components/form/TagWrapper';
import { INITIAL_PODCAST } from '../../constant/podcast';
import { IOpen } from '../../pages/podcaster/Podcast/PodcastPage';

export const getPodcastByPodcaster = async (
  search: string,
  page: number,
  size: number,
  sortColumnId: string,
  sortDirection: string,
  filterParams: IPodcastsFilterParams,
) => AxiosClient.post(
  `api/v1/podcasts/get-podcast-by-podcaster?searchString=${encodeURIComponent(
    search,
  )}&page=${
    page - 1
  }&size=${size}&sortColumn=${sortColumnId}&sortDirection=${sortDirection}`,
  {
    ...filterParams,
  },
);

export const getPodcastsFilter = async () => AxiosClient.get(PODCASTER_HOME.GET_PODCASTS_FILTER);

export const getPodcastDetail = async (
  slug: string,
  handlePodcastDetail: (value: any) => void,
  handleLoading: (value: boolean) => void,
) => {
  try {
    const response = await AxiosClient.get(
      `${PODCAST_DETAIL.GET_PODCAST_DETAIL}/${slug}`,
    );

    if (response.data.success) {
      handlePodcastDetail(response.data.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(TOASTER_STATUS.ERROR, error.message);
  } finally {
    handleLoading(false);
  }
};

export const updatePodcastMonetization = async (
  podcastId: string,
  isMonetized: boolean,
) => {
  try {
    const response = await AxiosClient.put(
      `${PODCAST_DETAIL.BASE_PODCAST_URL}/${podcastId}/${PODCAST_DETAIL.PODCAST_MONETIZE}/${isMonetized}`,
    );

    if (response.data.success) {
      showToastMessage(TOASTER_STATUS.SUCCESS, response.data.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
  }
};

export const getPodcastCategories = async (searchString: string = '') => AxiosClient(`api/v1/categories?searchString=${searchString}`);

export const getPodcastTypes = async (searchString: string = '') => AxiosClient(`api/v1/podcast-types?searchString=${searchString}`);

export const uploadPodcastImages = async (
  podcastUuid: string,
  thumbnailImage: File | string | null | Blob,
  coverImage: File | string | null | Blob,
) => {
  try {
    const formData: any = new FormData();
    if (coverImage || thumbnailImage) {
      formData.append('thumbnailImage', thumbnailImage);
      formData.append('coverImage', coverImage);
    }
    AxiosClient.post(
      `${PODCAST_API_ROUTES.UPLOAD_PODCAST_IMAGES}/${podcastUuid}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
  }
};

export const validateSlug = async (
  slugUrl: string,
  handleSlugStatus: (value: string) => void,
) => {
  try {
    const response = await AxiosClient.post(
      `api/v1/podcasts/checkSlugUrl?slugUrl=${slugUrl}`,
    );

    if (response.data.success) {
      handleSlugStatus(response.data.result.toLowerCase());
    } else {
      handleSlugStatus('');
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    handleSlugStatus('');
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
  }
};

export const getPodcastCategoriesAndTypes = async (
  handleLoading: (value: boolean) => void,
  handleOptions: (value: IPodcastOptions) => void,
) => {
  try {
    const categoriesResponse = await getPodcastCategories();
    const typesResponse = await getPodcastTypes();

    if (categoriesResponse.data.success && typesResponse.data.success) {
      handleOptions({
        categories: categoriesResponse.data.result,
        types: typesResponse.data.result,
      });
    } else {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        categoriesResponse.data.error.txt || typesResponse.data.error.txt,
      );
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
  } finally {
    handleLoading(false);
  }
};

export const addPodcast = async (
  podcast: any,
  thumbnailImage: File | string | null | Blob,
  coverImage: File | string | null | Blob,
  handleRedirect: (isAddUpdate: boolean) => void,
  handlePageLoading: (value: boolean) => void,
  openPodcastUploaded: (podcastId: string) => void,
  isOpenEditor?: boolean,
  redirectToAudioEditor?: (
    id: string,
    podcastId: string,
    slugUrl: string
  ) => void,
) => {
  try {
    const response = await AxiosClient.post(
      PODCAST_API_ROUTES.ADD_PODCAST,
      podcast,
    );

    if (response.data.success) {
      const podcastImages = await uploadPodcastImages(
        response.data.result.uuid,
        thumbnailImage,
        coverImage,
      );

      const episodeImages = await uploadEpisodeImages(
        response.data.result.firstEpisodeUUID,
        thumbnailImage,
        coverImage,
        handlePageLoading,
      );

      if (podcastImages !== null && episodeImages) {
        if (podcast.podcastStatus.toLowerCase() === PODCAST_STATUS.PUBLISH) {
          openPodcastUploaded(response.data.result.uuid);
        } else if (
          isOpenEditor
          && redirectToAudioEditor
          && podcast.podcastStatus.toLowerCase() === PODCAST_STATUS.DRAFT
        ) {
          redirectToAudioEditor(
            response.data.result.firstEpisodeUUID,
            response.data.result.uuid,
            podcast.slugUrl,
          );
        } else {
          handleRedirect(true);
        }
      }
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
  } finally {
    handlePageLoading(false);
  }
};

const doRedirect = (
  thumbnailImage: File | string | null | Blob,
  coverImage: File | string | null | Blob,
  podcastImageResponse: any,
  handleRedirect: (isAddUpdate: boolean) => void,
) => {
  switch (true) {
    case podcastImageResponse !== null:
      handleRedirect(true);
      break;
    case typeof thumbnailImage === 'string' && typeof coverImage === 'string':
      handleRedirect(true);
      break;
    case podcastImageResponse !== null && typeof coverImage === 'string':
      handleRedirect(true);
      break;
    case typeof thumbnailImage === 'string' && podcastImageResponse !== null:
      handleRedirect(true);
      break;
    default:
      break;
  }
};

export const updatePodcast = async (
  podcast: IPodcastForm,
  podcastId: string,
  handleRedirect: (isAddUpdate: boolean) => void,
  handlePageLoading: (value: boolean) => void,
  options: IPodcastOptions,
  initialPodcastStatus: string,
) => {
  try {
    const newPodcast: IPodcast = {
      categoryUuid: getUuidFromOptionName(
        options.categories,
        podcast.podcastCategory,
      ),
      podcastTypeUuid: getUuidFromOptionName(
        options.types,
        podcast.podcastType,
      ),
      name: podcast.podcastTitle,
      description: podcast.description,
      podcastCountry: podcast.country,
      podcastStatus: podcast.status?.toUpperCase(),
      tagNames: podcast.tags?.map((tag: ITag) => tag?.value),
      slugUrl: podcast.slugUrl,
      monetized: podcast.monetized,
      warnListeners: podcast.warnListeners,
      podcastLanguage: podcast.language,
      scheduledDate: getScheduledDateTime(podcast.date, podcast.time) ?? 0,
    };
    const response = await AxiosClient.put(
      `${
        initialPodcastStatus === PODCAST_STATUS.PUBLISH
          ? PODCAST_API_ROUTES.UPDATE_PUBLISHED_PODCAST
          : PODCAST_API_ROUTES.UPDATE_PODCAST
      }/${podcastId}`,
      initialPodcastStatus === PODCAST_STATUS.PUBLISH
        ? {
          description: podcast.description,
          monetized: podcast.monetized,
          tagNames: podcast.tags?.map((tag: ITag) => tag?.value),
        }
        : newPodcast,
    );

    if (response.data.success) {
      let podcastImageResponse = null;
      if (podcast.status?.toUpperCase() !== 'PUBLISHED') {
        podcastImageResponse = await uploadPodcastImages(
          response.data.result,
          typeof podcast.thumbnail !== 'string' ? podcast.thumbnail : null,
          typeof podcast.cover !== 'string' ? podcast.cover : null,
        );
      }

      doRedirect(
        podcast.thumbnail,
        podcast.cover,
        podcastImageResponse,
        handleRedirect,
      );
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
  } finally {
    handlePageLoading(false);
  }
};

export const getPodcastByUuid = async (
  uuid: string,
  handlePageLoading: (value: boolean) => void,
  handlePodcast: (value: IPodcastForm) => void,
) => {
  try {
    const response = await AxiosClient.get(
      `${PODCAST_API_ROUTES.GET_PODCAST}/${uuid}`,
    );

    if (response.data.success) {
      const podcast: IPodcastForm = {
        ...INITIAL_PODCAST,
        thumbnail: response.data.result.thumbnailImage,
        cover: response.data.result.coverImage,
        podcastTitle: response.data.result.name,
        podcastCategory: response.data.result.category?.name,
        podcastType: response.data.result.podcastType?.name,
        country: response.data.result.podcastCountry,
        language: response.data.result.podcastLanguage,
        description: response.data.result.description,
        tags: response.data.result.tags?.map((tag: any) => ({
          key: tag.uuid,
          value: tag.tagName,
        })),
        monetized: response.data.result.monetized,
        warnListeners: response.data.result.warnListeners,
        slugUrl: response.data.result.slugUrl,
        date: getDateOrTimeFromStatus(
          response.data.result.publishedOrScheduleDate,
          'YYYY-MM-DD',
          response.data.result.podcastStatus,
        ),
        time: getDateOrTimeFromStatus(
          response.data.result.publishedOrScheduleDate,
          'HH:mm',
          response.data.result.podcastStatus,
        ),
        status: response.data.result.podcastStatus,
        featured: response.data.result.featured,
        upgradePlanForFeatured: response.data.result.upgradePlanForFeatured,
      };

      handlePodcast(podcast);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
  } finally {
    handlePageLoading(false);
  }
};

export const setFeaturedPodcast = async (
  podcastId: string,
  featured: boolean,
  startDate: number,
  endDate: number,
  handleFeature: (value: keyof IOpen) => void,
  handleDisabled: CallableFunction = () => {},
) => {
  try {
    const response = await AxiosClient.post(
      `${PODCAST_API_ROUTES.GET_PODCAST}/${podcastId}/${PODCAST_API_ROUTES.FEATURED}`,
      {
        activated: featured,
        startDate,
        endDate,
      },
    );

    if (response.data.success) {
      if (featured) handleFeature('feature');
      showToastMessage(
        TOASTER_STATUS.SUCCESS,
        'Podcast featured updated successfully!!',
      );
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response.data.error.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error.message,
    );
  } finally {
    handleDisabled(false);
  }
};

export const createRssFeed = async (
  podcastSlug: string,
  handleLoading: (value: boolean) => void,
  onContinue: (isRssFeedCreated: boolean) => void,
) => {
  try {
    const response = await AxiosClient.post(
      `${PODCAST_API_ROUTES.CREATE_RSS_FEED}/${podcastSlug}`,
    );
    if (response?.data?.success) {
      onContinue(response?.data?.success);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error?.message,
    );
  } finally {
    handleLoading(false);
  }
};

export const deletePodcast = async (id: string) => AxiosClient.delete(`${PODCAST_API_ROUTES.DELETE_PODCAST}/${id}`);

export const getEpisodes = async (
  handleEpisodesDetails: (details: any) => void,
  slugUrl: string,
  page: number = 0,
  size: number = 10,
  searchValue: string = '',
) => {
  try {
    const response = await AxiosClient(
      `${
        PODCAST_API_ROUTES.GET_EPISODES
      }/${slugUrl}?searchString=${encodeURIComponent(
        searchValue,
      )}&page=${page}&size=${size}`,
    );
    if (response?.data?.success) {
      handleEpisodesDetails(response?.data?.result);
    } else {
      showToastMessage(TOASTER_STATUS.ERROR, response?.data?.error?.txt);
    }
  } catch (error: any) {
    showToastMessage(
      TOASTER_STATUS.ERROR,
      error?.response?.data?.result?.errorMessage ?? error?.message,
    );
  }
};
