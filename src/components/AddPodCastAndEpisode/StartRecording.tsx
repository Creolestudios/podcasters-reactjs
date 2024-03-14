import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
// @ts-ignore
import AudioAnalyser from 'react-audio-analyser';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PauseIcon from '../../assets/svg/PauseIcon';
import RecordIcon from '../../assets/svg/RecordIcon';
import StopIcon from '../../assets/svg/StopIcon';
import MicrophonePermissionModal from '../Modal/PermissionModal';
import { CLOUDINARY_URL } from '../../clientConfig';
import { formatTime, getMinutesFromSeconds } from '../../utils';
import Loader from '../Loader/Loader';
import AudioLimitWarningModal from './AudioLimitWarningModal';

interface StartRecordingProps {
  setStage: Dispatch<SetStateAction<number>>;
  handleAudioChange: (
    e: File,
    isEnhanced?: boolean,
    callback?: () => void,
  ) => void;
  isUploading: boolean;
  uploadProcess: number;
  uploadAudioDuration: number;
}

const StartRecording = ({
  setStage,
  handleAudioChange,
  isUploading,
  uploadProcess,
  uploadAudioDuration,
}: StartRecordingProps) => {
  const [showModel, setShowModel] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [openWarningModal, setOpenWarningModal] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [status, setStatus] = useState<string>('');

  const controlAudio = (status: string) => {
    setStatus(status);
  };

  const handleStartRecording = () => {
    if (time < uploadAudioDuration) {
      if (error) setShowModel(true);
      if (!error) controlAudio('recording');
      if (!error) setIsPaused(!isPaused);
    } else {
      setOpenWarningModal(true);
    }
  };

  const handlePauseRecording = () => {
    if (error) setShowModel(true);
    if (!error) controlAudio('paused');
    if (!error) setIsPaused(!isPaused);
  };

  const handleStopRecording = () => {
    if (!error) controlAudio('inactive');
  };

  const handleAudioOutput = (blob: any) => {
    const audioFile = new File([blob], 'recordedAudio.wav', {
      type: blob.type,
    });
    handleAudioChange(audioFile, false, () => setStage((e: number) => e + 1));
  };

  const audioProps = {
    audioType: 'audio/wav',
    backgroundColor: 'transparent',
    foregroundColor: 'rgb(226,249,82)',
    strokeColor: 'rgb(226,249,82)',
    audioBitsPerSecond: 64000,
    echoCancelation: true,
    width: 800,
    className: 'd-flex align-items-center ',
    status,
    timeslice: 1000,
    stopCallback: (e: any) => {
      handleAudioOutput(e);
    },
    onRecordCallback: () => {
      const totalTime = time + 1;
      setTime(totalTime);
      if (totalTime === uploadAudioDuration) {
        setOpenWarningModal(true);
        controlAudio('paused');
        setIsPaused(true);
      }
    },
    errorCallback: (err: any) => {
      setError(true);
      setShowModel(true);
    },
  };

  useEffect(() => {
    setIsPaused(true);
    controlAudio('paused');
  }, []);

  useEffect(() => {
    if (error) setIsPaused(true);
  }, [error]);

  if (isUploading) {
    return (
      <div className='big-height position-relative'>
        <img
          src={`${CLOUDINARY_URL}Images/recoding-ready.png`}
          alt='recoding-ready'
          className='img-fluid d-block mx-auto'
        />
        <div className='h-100 w-100 position-absolute top-0 d-flex align-items-center justify-content-center'>
          <div className='h-100 d-flex justify-content-center flex-column gap-3'>
            <Loader className='aliceblue-loader' />
            <span className='drop-zone__prompt d-block text-white'>
              Uploading Audio
              <br />
              (
              {uploadProcess ?? 0}
              % Uploaded)
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='col-lg-12 form-style'>
      {/* eslint-disable-next-line */}
      <label htmlFor='podcast-title'>Record Audio</label>
      <div className='big-height record-audio bg-img  position-relative recording-container'>
        <img
          src={`${CLOUDINARY_URL}Images/start-recording-new.png`}
          alt='start-recording'
          loading='lazy'
          className='img-fluid d-block mx-auto'
        />
        <div className='after-before-container py-5 overflow-hidden'>
          <div className='container-microphone'>
            <button
              type='button'
              id='speech'
              className='btn-mic'
              onClick={() => {
                if (error) {
                  setShowModel(true);
                }
                if (!error) controlAudio('recording');
                if (!error) setIsPaused(!isPaused);
              }}
            >
              {!isPaused && <div className='pulse-ring' />}
              <div className='pulse-ring2' />
              <FontAwesomeIcon
                className='Mic-icon position-relative'
                icon={faMicrophone}
                style={{ color: '#9244EB', height: '50px' }}
              />
            </button>
          </div>
          <div className='recording-timer h-25 z-10 mt-5 d-flex justify-content-center align-items-center'>
            {formatTime(time)}
          </div>
          <div className='h-100 position-relative d-flex justify-content-center audio-wave'>
            <div className='d-flex w-100 justify-content-center'>
              {/* eslint-disable-next-line */}
              <AudioAnalyser {...audioProps}></AudioAnalyser>
            </div>
          </div>
          <div className='audio-control-recording'>
            {isPaused ? (
              // eslint-disable-next-line
              <span className='pause-audio' onClick={handleStartRecording}>
                <RecordIcon />
              </span>
            ) : (
              // eslint-disable-next-line
              <span className='resume-audio' onClick={handlePauseRecording}>
                <PauseIcon />
              </span>
            )}
            {/* eslint-disable-next-line */}
            <span
              className='stop-audio'
              onClick={() => {
                if (!error) controlAudio('inactive');
              }}
            >
              <StopIcon />
            </span>
          </div>
        </div>
      </div>
      <MicrophonePermissionModal
        show={showModel}
        onHide={() => setShowModel(false)}
      />
      <AudioLimitWarningModal
        open={openWarningModal}
        close={() => setOpenWarningModal(false)}
        onContinue={() => {
          setOpenWarningModal(false);
          handleStopRecording();
        }}
        message={`You reached your recording limit of ${getMinutesFromSeconds(
          uploadAudioDuration,
        )
          .replace('min', 'Minutes')
          .replace('sec', 'Seconds')}!`}
        buttonText='Continue'
      />
    </div>
  );
};

export default StartRecording;
