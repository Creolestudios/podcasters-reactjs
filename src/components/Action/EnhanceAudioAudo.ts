import axios from 'axios';

interface AdminLoginVerifierInterface {
  userName: string;
  password: string;
}
// API base URL and key
const API_AUDIO_BASE_URL = process.env.REACT_APP_API_AUDIO_BASE_URL;
const API_AUDIO_KEY = process.env.REACT_APP_API_AUDIO_KEY;

// Define the headers object with the API key
const headers = {
  headers: {
    'x-api-key': API_AUDIO_KEY,
  },
};

// Function to download audio file
export const audioDownload = async (downloadPath: string, callBack: (data: any) => void) => {
  const response = await axios.get(`${API_AUDIO_BASE_URL}${downloadPath}`, {
    ...headers,
    responseType: 'arraybuffer',
    onDownloadProgress: callBack,
  });

  return response;
};

// Function to enhance audio
export const enhanceAudio = async (formData: FormData, callBack: (data: any) => void): Promise<any> => {
  const config = {
    headers: {
      'x-api-key': API_AUDIO_KEY,
      'content-type': 'multipart/form-data',
    },
    onUploadProgress: callBack,
  };
  const response = await axios.post(`${API_AUDIO_BASE_URL}/upload`, formData, config);

  return response;
};

// Function to remove noise from audio
export const removeNoise = async (fileId: string) => {
  const response = await axios.post(
    `${API_AUDIO_BASE_URL}/remove-noise`,
    { input: fileId },
    {
      ...headers,
    },
  );

  return response;
};

// Function to check audio processing status
export const audioStatus = async (jobId: string): Promise<any> => {
  const response = await axios.get(`${API_AUDIO_BASE_URL}/remove-noise/${jobId}/status`, {
    ...headers,
  });

  return response;
};
