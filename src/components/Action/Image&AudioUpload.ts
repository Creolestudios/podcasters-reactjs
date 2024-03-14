import axios from 'axios';
import { EPISODE_API_ROUTES } from '../../constant/apiRoute';
import AxiosClient from '../../services/AxiosClient';

export const uploadAudioFile = async (presignedURL: string, file: any) => {
  try {
    const options = {
      headers: {
        'Content-Type': file.type,
        'x-amz-acl': 'public-read',
      },
    };
    const result = await axios.put(`${presignedURL}`, file, options);
    if (result.status === 201 || result.status === 200) {
      return result.data;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const transcriptAndAudioFile = async (uuid:string, file: File, callBack: (data: any) => void) => {
  const formdata = new FormData();
  formdata.append('file', file);
  try {
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      },
      onUploadProgress: callBack,
    };
    const result = await AxiosClient.post(`${EPISODE_API_ROUTES.UPLOAD_FILE}${uuid}`, formdata, options);
    return result.data;
  } catch (err) {
    return err;
  }
};
