import React, { Dispatch, SetStateAction } from 'react';

import RecordAudio from '../../assets/svg/RecordAudio';
import UploadAudio from '../../assets/svg/UploadAudio';
import DragDropFile from '../DragAndDrop/DragDropFile';
import EnhanceAudio from './EnhnaceAudio';
import Loader from '../Loader/Loader';
import { getMinutesFromSeconds } from '../../utils';

type AudioContextType = File | string;

interface IProps {
  setStage: (val: number) => void;
  setEnhancedAudio: Dispatch<SetStateAction<AudioContextType>>;
  setAudioType: Dispatch<SetStateAction<'recorded' | 'uploaded' | ''>>;
  setUploadedFile: (val: string) => void;
  uploadedFile: string;
  isEnhancing: boolean;
  setIsEnhancing: Dispatch<SetStateAction<boolean>>;
  setDownloadPath?: React.Dispatch<React.SetStateAction<string>>;
  handlePageLoading?: (value: boolean) => void;
  status?: string;
  formInstance?: any;
  handleClick?: (value: any, isOpenEditor: boolean) => void;
  initialUploadedAudio?: any;
  isAudioEdited?: boolean;
  isUploading: boolean;
  uploadProcess: number;
  id?: string | null;
  audioName?: string | null;
  redirectToAudioEditor?: (id: string) => void;
  handleAudioChange: (e: File) => void;
  setIsProcessing: (e: boolean) => void;
  uploadAudioDuration: number;
  enhanceAudioDuration: number;
  refetchLimits: () => void;
}

const RecordFileData: React.FC<IProps> = ({
  setStage,
  setEnhancedAudio,
  setUploadedFile,
  uploadedFile,
  isEnhancing,
  setIsEnhancing,
  setDownloadPath,
  handlePageLoading,
  status,
  formInstance,
  handleClick,
  initialUploadedAudio,
  isAudioEdited,
  id,
  audioName,
  redirectToAudioEditor,
  handleAudioChange,
  setAudioType,
  isUploading,
  uploadProcess,
  setIsProcessing,
  uploadAudioDuration,
  enhanceAudioDuration,
  refetchLimits,
}) => {
  if (isUploading) {
    return (
      <div className='big-height'>
        <div className='drop-zone p-3'>
          <span className='mb-2'>
            <Loader />
          </span>
          <span className='drop-zone__prompt d-block'>
            Uploading Audio
            <br />
            {' '}
            (
            {uploadProcess ?? 0}
            % Uploaded)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className='record-file-data'>
      {!uploadedFile ? (
        <>
          <div className='row'>
            <div className='col-lg-12 form-style'>
              {/* eslint-disable-next-line */}
              <label htmlFor='podcast-title'>Upload Audio</label>
              <div className='big-height'>
                <DragDropFile
                  accept='audio/*'
                  handleFile={(e) => {
                    setAudioType('uploaded');
                    handleAudioChange(e);
                  }}
                  disabled={uploadAudioDuration < 1}
                  icon={<UploadAudio />}
                  maxFileSize={50}
                  maxDuration={uploadAudioDuration}
                  sizeIn='MB'
                  width={0}
                  height={0}
                  isAudio
                />
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-12 form-style'>
              {/* eslint-disable-next-line */}
              <label htmlFor='podcast-title'>Record Audio</label>
              <div className='big-height'>
                {/* eslint-disable-next-line */}
                <div
                  className={`drop-zone ${
                    uploadAudioDuration < 1 ? 'cursor-not-allowed' : ''
                  }`}
                  onClick={() => {
                    if (uploadAudioDuration > 0) {
                      setAudioType('recorded');
                      setStage(1);
                    }
                  }}
                >
                  <span className='mb-3'>
                    <RecordAudio />
                  </span>
                  <span className='drop-zone__prompt d-block'>
                    <span>Record the audio</span>
                    {!!uploadAudioDuration && (
                      <div>
                        Max record limit
                        {' '}
                        {getMinutesFromSeconds(uploadAudioDuration)
                          .replace('min', 'Minutes')
                          .replace('sec', 'Seconds')}
                        .
                      </div>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <EnhanceAudio
          setEnhancedAudio={setEnhancedAudio}
          setStage={setStage}
          setUploadedFile={setUploadedFile}
          uploadedFile={uploadedFile}
          isEnhancing={isEnhancing}
          setIsEnhancing={setIsEnhancing}
          setDownloadPath={setDownloadPath}
          handlePageLoading={handlePageLoading}
          status={status}
          formInstance={formInstance}
          handleClick={handleClick}
          initialUploadedAudio={initialUploadedAudio}
          isAudioEdited={isAudioEdited}
          id={id}
          audioName={audioName}
          redirectToAudioEditor={redirectToAudioEditor}
          setIsProcessing={setIsProcessing}
          enhanceAudioDuration={enhanceAudioDuration}
          refetchLimits={refetchLimits}
        />
      )}
    </div>
  );
};

RecordFileData.defaultProps = {
  setDownloadPath: undefined,
  handlePageLoading: () => {},
  status: '',
  formInstance: undefined,
  handleClick: () => {},
  initialUploadedAudio: undefined,
  isAudioEdited: false,
  id: null,
  audioName: null,
  redirectToAudioEditor: () => {},
};

export default RecordFileData;
