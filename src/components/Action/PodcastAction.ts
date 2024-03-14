import axios from 'axios';
import {
  episodeDataInterface,
  updateEpisodeDataInterface,
  uploadThumbnailImageInterface,
} from '../../types/episodeDataInterface';

const apiUrl = process.env.REACT_APP_BASE_URL;

const config = {
  headers: {
    'content-type': 'application/json',
  },
};

// Function to add a podcast
export const addPodcast = (data: episodeDataInterface) => {
  const response = axios.post(`${apiUrl}rest/podcasts`, data, config);

  return response;
};

// Function to delete a podcast
export const deletePodcast = async (id: string) => {
  const response = await axios.delete(`${apiUrl}rest/podcasts/${id}`, config);

  return response;
};

// Function to fetch all podcasts
export const fetchAllPodcasts = async (page: number, size: number, searchString = '') => {
  const response = await axios.get(
    `${apiUrl}rest/podcasts/getPodcastByPodcaster?searchString=${searchString}&page=${page}&size=${size}`,
    config,
  );

  return response;
};

// Function to fetch a podcast by ID
export const fetchPodcastById = async (id: string) => {
  const response = await axios.get(`${apiUrl}rest/podcasts/${id}`, config);

  return response;
};

// Function to fetch podcasts with episodes
export const fetchPodcastsWithEpisodes = async (id: string | null) => {
  const response = await axios.get(`${apiUrl}rest/podcasts/getPodcastsWithEpisodes/${id}`, config);

  return response;
};

// Function to update a podcast
export const updatePodcast = async (id: string, data: updateEpisodeDataInterface) => {
  const response = await axios.put(`${apiUrl}rest/podcasts/${id}`, data, config);

  return response;
};

// Function to update a podcast
export const publishPodcast = async (id: string | null, status: string | null) => {
  const response = await axios.put(`${apiUrl}rest/podcasts/${id}/${status}`, {}, config);

  return response;
};

// Function to upload podcast image
export const uploadPodcastBannerImage = async (data: uploadThumbnailImageInterface) => {
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };
  const response = await axios.post(`${apiUrl}rest/podcasts/uploadPodcastImage`, data, config);

  return response;
};

export const uploadPodcastThumbnailImage = async (data: uploadThumbnailImageInterface) => {
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };
  const response = axios.post(`${apiUrl}rest/podcasts/uploadPodcastThumbnailImage`, data, config);

  return response;
};

// Function to upload podcast image
export const getPressingURLToUpload = async (data: {
  extensionProcessedFile: string;
  extensionRecordedFile: string;
}) => {
  const response = await axios.post(`${apiUrl}rest/episodes/getPresignedUrl`, data, config);

  return response;
};

// Function to verify that slug url already exist or not
export const checkSlugUrl = async (data: string): Promise<any> => {
  const response = await axios.post(`${apiUrl}rest/podcasts/checkSlugUrl?slugUrl=${data}`, config);

  return response;
};
