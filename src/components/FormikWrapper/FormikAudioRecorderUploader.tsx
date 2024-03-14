import React, { FC, useState, useEffect } from 'react';
import { useField, useFormikContext } from 'formik';
import { v4 as UUID } from 'uuid';

import { connect } from 'react-redux';
import RecordFileData from '../AddPodCastAndEpisode/RecordFileData';
import EnableRecord from '../AddPodCastAndEpisode/EnableRecord';
import StartRecording from '../AddPodCastAndEpisode/StartRecording';
import EnhanceAudio from '../AddPodCastAndEpisode/EnhnaceAudio';
import BeforeAfterRecording from '../AddPodCastAndEpisode/BeforeAfterRecording';
import AcceptedRecord from '../AddPodCastAndEpisode/AcceptedRecord';

import '../../assets/scss/add-podcast.scss';
import { transcriptAndAudioFile } from '../Action/Image&AudioUpload';
import { CLOUDINARY_URL } from '../../clientConfig';
import { TOASTER_STATUS } from '../../constant';
import { showToastMessage } from '../../utils';
import { calculateUploadPercentage } from '../../services/utils';
import { IState } from '../../redux/types';
import { getUser } from '../../redux/selectors/user';
import { IUser } from '../../types';

interface IProps {
  onSetHasAudio: (value: boolean) => void;
  uploadedAudio: string;
  status?: string;
  handleSubmit?: (value: any, isOpenEditor: boolean) => void;
  handleAudioRecorderUploaderStage?: (value: number) => void;
  isAudioEdited?: boolean;
  id?: string | null;
  audioName?: string | null;
  redirectToAudioEditor?: (id: string) => void;
  setIsProcessing: (value: boolean) => void;
  user: IUser;
  uploadAudioDuration: number;
  enhanceAudioDuration: number;
  refetchLimits: () => void;
}

const FormikAudioRecorderUploader: FC<IProps> = ({
  onSetHasAudio,
  uploadedAudio,
  status,
  handleSubmit,
  handleAudioRecorderUploaderStage,
  isAudioEdited,
  id,
  audioName,
  redirectToAudioEditor,
  setIsProcessing,
  user,
  uploadAudioDuration,
  enhanceAudioDuration,
  refetchLimits,
}) => {
  const formik = useFormikContext();

  const [uploadField, uploadMeta, upload] = useField({ name: 'uploadedAudio' });
  const [enhanceField, enhanceMeta, enhance] = useField({
    name: 'enhancedAudio',
  });
  const [transcriptFiled, transcriptMeta, transcriptUuid] = useField({
    name: 'transcriptUuid',
  });
  const [sentimentField, sentimentMeta, sentiment] = useField({
    name: 'sentimentNames',
  });

  const [uploadedAudioUuid, setUploadedAudioUuid] = useState<string>('');
  const [enhancedAudioUuid, setEnhancedAudioUuid] = useState<string>('');
  const [stage, setStage] = useState<number>(0);
  const [audioType, setAudioType] = useState<'recorded' | 'uploaded' | ''>('');
  const [uploadedFile, setUploadedFile] = useState<string>('');
  const [enhancedAudio, setEnhancedAudio] = useState<string | File>('');
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [downloadPath, setDownloadPath] = useState<string>('');
  const [sentiments, setSentiments] = useState<string[]>([]);
  const [uploadProcess, setUploadProcess] = useState<number>(0);

  useEffect(() => {
    upload.setValue(uploadedFile);
    enhance.setValue(enhancedAudio);
    sentiment.setValue(sentiments);
    transcriptUuid.setValue(enhancedAudio ? enhancedAudioUuid : uploadedAudioUuid);

    onSetHasAudio(!!(uploadedFile || enhancedAudio));

    if (handleAudioRecorderUploaderStage) {
      handleAudioRecorderUploaderStage(stage);
    }
  }, [stage, uploadedFile, sentiments, uploadedAudioUuid, enhancedAudioUuid]);

  useEffect(() => {
    setUploadedFile(uploadedAudio);
  }, [uploadedAudio]);

  const handleAudioChange = async (e: File, isEnhanced?: boolean, callback?: () => void) => {
    setIsProcessing(true);
    setIsUploading(true);
    const newUUID = UUID();
    if (isEnhanced) {
      setEnhancedAudioUuid(newUUID);
    } else {
      setUploadedAudioUuid(newUUID);
    }
    await transcriptAndAudioFile(newUUID, e, (data: any) => {
      const process = calculateUploadPercentage(data);
      setUploadProcess(process);
    })
      .then((response) => {
        if (response?.result) {
          if (isEnhanced) {
            setEnhancedAudio(`${CLOUDINARY_URL}${response.result}`);
            setStage(5);
          } else {
            setUploadedFile(`${CLOUDINARY_URL}${response.result}`);
          }
          if (callback) {
            callback();
          }
        } else {
          showToastMessage(TOASTER_STATUS.ERROR, 'Something went wrong');
        }
      })
      .catch((error) => {
        showToastMessage(TOASTER_STATUS.ERROR, error.data.error.txt);
      });
    setUploadProcess(0);
    setIsUploading(false);
    setIsProcessing(false);
  };

  const handleSwitchCase = () => {
    switch (stage) {
      case 0:
        return (
          <RecordFileData
            setStage={setStage}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            setIsEnhancing={setIsEnhancing}
            isEnhancing={isEnhancing}
            setEnhancedAudio={setEnhancedAudio}
            setDownloadPath={setDownloadPath}
            status={status}
            formInstance={formik}
            handleClick={handleSubmit}
            initialUploadedAudio={uploadedAudio}
            isAudioEdited={isAudioEdited}
            id={id}
            audioName={audioName}
            redirectToAudioEditor={redirectToAudioEditor}
            handleAudioChange={handleAudioChange}
            setAudioType={setAudioType}
            isUploading={isUploading}
            uploadProcess={uploadProcess}
            setIsProcessing={setIsProcessing}
            uploadAudioDuration={uploadAudioDuration}
            enhanceAudioDuration={enhanceAudioDuration}
            refetchLimits={refetchLimits}
          />
        );
      case 1:
        return <EnableRecord setStage={setStage} />;
      case 2:
        return (
          <StartRecording
            setStage={setStage}
            handleAudioChange={handleAudioChange}
            isUploading={isUploading}
            uploadProcess={uploadProcess}
            uploadAudioDuration={uploadAudioDuration}
          />
        );
      case 3:
        return (
          <EnhanceAudio
            setStage={setStage}
            setEnhancedAudio={setEnhancedAudio}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            isEnhancing={isEnhancing}
            setIsEnhancing={setIsEnhancing}
            setDownloadPath={setDownloadPath}
            formInstance={formik}
            handleClick={handleSubmit}
            initialUploadedAudio={uploadedAudio}
            setIsProcessing={setIsProcessing}
            enhanceAudioDuration={enhanceAudioDuration}
            refetchLimits={refetchLimits}
          />
        );
      case 4:
        return (
          <BeforeAfterRecording
            setStage={setStage}
            audioType={audioType}
            uploadedFile={uploadedFile}
            enhancedAudio={enhancedAudio}
            sentiments={sentiments}
            setSentiments={setSentiments}
            handleAudioChange={handleAudioChange}
            setEnhancedAudio={setEnhancedAudio}
            isUploading={isUploading}
            uploadProcess={uploadProcess}
          />
        );
      case 5:
        return (
          <AcceptedRecord
            setUploadedFile={setUploadedFile}
            setStage={setStage}
            setEnhancedAudio={setEnhancedAudio}
            enhancedAudio={enhancedAudio}
            downloadPath={downloadPath}
            sentiments={sentiments}
            setSentiments={setSentiments}
            formInstance={formik}
            handleClick={handleSubmit}
            user={user}
          />
        );
      default:
        return null;
    }
  };

  return handleSwitchCase();
};

FormikAudioRecorderUploader.defaultProps = {
  status: '',
  handleSubmit: () => {},
  handleAudioRecorderUploaderStage: () => {},
  isAudioEdited: false,
  id: null,
  audioName: null,
  redirectToAudioEditor: () => {},
};

const mapStateToProps = (state: IState) => ({
  user: getUser(state),
});

export default connect(mapStateToProps, null)(FormikAudioRecorderUploader);
