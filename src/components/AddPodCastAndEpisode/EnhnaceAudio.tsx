import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { connect } from 'react-redux';
import { CLOUDINARY_URL } from '../../clientConfig';
import RemoveIcon from '../../assets/svg/RemoveIcon';
import {
  audioDownload, audioStatus, enhanceAudio, removeNoise,
} from '../Action/EnhanceAudioAudo';
import ModalWrapper from '../form/ModalWrapper';
import Loader from '../Loader/Loader';
import DeleteModal from '../Modal/DeleteModal';
import { toaster } from '../Toast/Toaster';
import AudioWave from './AudioWave';
import { PLAN_ACTIONS, PODCAST_STATUS, TOASTER_STATUS } from '../../constant';
import SvgIcons from '../../assets/svg/SvgIcons';
import { getMinutesFromSeconds, showToastMessage } from '../../utils';
import { OPEN_EDITOR } from '../../constant/modal';
import SelectWrapper from '../Dropdown/SelectWrapper';
import { exportAudio } from '../../services/podcaster/AudioEditor';
import { calculateUploadPercentage } from '../../services/utils';
import APP_ROUTES, { PODCASTER_APP_ROUTES as PODCASTER } from '../../constant/appRoute';
import { paymentPlanAction } from '../../services/podcaster/Subscription';
import { IState } from '../../redux/types';
import { getUser } from '../../redux/selectors/user';
import { IUser } from '../../types';
import TooltipWrapper from '../Tooltip/TooltipWrapper';
import { updateEnhanceDuration } from '../../services/podcaster/Episode';

type AudioContextType = File | string;

interface Iprops {
  setStage: (val: number) => void;
  setEnhancedAudio: React.Dispatch<React.SetStateAction<AudioContextType>>;
  uploadedFile: string;
  setUploadedFile: (val: string) => void;
  isEnhancing: boolean;
  setIsEnhancing: React.Dispatch<React.SetStateAction<boolean>>;
  setDownloadPath?: React.Dispatch<React.SetStateAction<string>> | undefined;
  handlePageLoading?: (value: boolean) => void;
  status?: string;
  formInstance?: any;
  handleClick?: (value: any, isOpenEditor: boolean) => void;
  initialUploadedAudio?: any;
  isAudioEdited?: boolean;
  id?: string | null;
  audioName?: string | null;
  redirectToAudioEditor?: (id: string) => void;
  setIsProcessing: (value: boolean) => void;
  user: IUser;
  refetchLimits: () => void;
  enhanceAudioDuration: number;
}

const EnhanceAudio: React.FC<Iprops> = ({
  setStage,
  setEnhancedAudio,
  uploadedFile,
  setUploadedFile,
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
  setIsProcessing,
  user,
  enhanceAudioDuration,
  refetchLimits,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isOpenEditor, setIsOpenEditor] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(true);
  const [enhanceMessage, setEnhanceMessage] = useState<string>('');
  const [upgradePlanPopup, setUpgradePlanPopup] = useState<boolean>(false);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoading = (value: boolean) => setIsLoading(value);

  // Function to handle downloading the processed audio
  const handleDownload = useCallback(async (downloadPath) => {
    try {
      const response = await audioDownload(downloadPath, (data) => {
        const process = calculateUploadPercentage(data);
        setEnhanceMessage(`Generating Audio (${process ?? 100}%)`);
      });
      updateEnhanceDuration(Number(audioRef?.current?.duration)).then(() => refetchLimits());
      const processedAudioBlob = new Blob([response.data], {
        type: 'audio/*',
      });
      const processedAudioFile = new File([processedAudioBlob], 'enhancedAudio.wav', {
        type: 'audio/wav',
      });
      setEnhancedAudio(processedAudioFile);
      setIsEnhancing(false);
      setIsProcessing(false);
      setStage(4);
      if (handlePageLoading) {
        handlePageLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsEnhancing(false);
      setIsProcessing(false);
    }
  }, []);

  const handleGetStatus = useCallback(async (jobId) => {
    try {
      const response = await audioStatus(jobId);
      setEnhanceMessage(`Removing Noise (${response?.data?.percent ?? 100}%)`);
      if (response.data.downloadPath) {
        setEnhanceMessage('Generating Audio (0%)');
        const { downloadPath } = response.data;
        if (setDownloadPath) setDownloadPath(downloadPath || '');
        if (downloadPath) {
          handleDownload(downloadPath);
        }
      } else {
        // If the processing is not complete, retry after a delay
        setTimeout(() => {
          handleGetStatus(jobId);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleRemoveNoise = useCallback(async (fileId) => {
    setEnhanceMessage('Removing Noise (0%)');
    try {
      await removeNoise(fileId)
        .then((response) => {
          const { jobId } = response.data;
          handleGetStatus(jobId);
        })
        .catch(() => {
          setIsEnhancing(false);
          setIsProcessing(false);
          showToastMessage(TOASTER_STATUS.ERROR, 'Something went wrong!');
        });
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Function to enhance the recording
  const enhanceRecording = useCallback(async (audio) => {
    setIsEnhancing(true);
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', audio, 'processedAudio.wav');
    try {
      await enhanceAudio(formData, (data: any) => {
        const process = calculateUploadPercentage(data);
        setEnhanceMessage(`Processing Audio (${process}%)`);
      })
        .then((response) => {
          const { fileId } = response.data;
          handleRemoveNoise(fileId);
        })
        .catch((error) => {
          setIsEnhancing(false);
          setIsProcessing(false);
          toast(toaster('ERROR', error.message || 'Audio file is not supported.'));
        });
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Function to upload either recorded audio or uploaded audio file
  const uploadFileOrRecordFile = async () => {
    if (!isEnhancing) {
      setIsEnhancing(true);
      setIsProcessing(true);
      setEnhanceMessage('Processing Audio (0%)');
      const response = await fetch(uploadedFile);
      const audioBlob = await response.blob();
      const uploadedAudioBlob = audioBlob;
      enhanceRecording(uploadedAudioBlob);
    }
  };

  // Function to handle removing the enhanced audio
  const handleRemoveAudio = () => {
    setEnhancedAudio('');
    setUploadedFile('');
    setStage(0);

    if (isAudioEdited) {
      navigate(location.pathname, {
        state: { podcastId: location.state.podcastId },
      });
    }
  };

  const onCancelOpenEditor = () => setIsOpenEditor(false);

  const onOpenEditor = () => {
    const pathNameList = location.pathname.split('/');

    if (pathNameList.length === 5 && pathNameList.at(-1) === 'edit') {
      if (initialUploadedAudio === uploadedFile && redirectToAudioEditor) {
        redirectToAudioEditor(pathNameList.at(-2) ?? '');
      } else {
        setIsOpenEditor(true);
      }
    } else {
      setIsOpenEditor(true);
    }
  };

  const onOpenEditorOk = () => {
    if (formInstance) {
      if (Object.keys(formInstance.errors).length === 0 && handleClick) {
        handleClick({ ...formInstance.values, status: 'draft' }, true);
      } else {
        formInstance.handleSubmit();
        showToastMessage(TOASTER_STATUS.ERROR, 'Please fill all required fields');
      }
      setIsOpenEditor(false);
    }
  };

  useEffect(() => {
    if (paymentIntent) {
      navigate(`${PODCASTER.ROOT}/${APP_ROUTES.PAYMENT}`, {
        state: paymentIntent,
      });
    }
  }, [paymentIntent]);

  const handlepaymentIntent = (value: any) => setPaymentIntent(value);
  const handlePaymentPlanAction = (planAction: any) => {
    paymentPlanAction(planAction, handleLoading, handlepaymentIntent);
  };

  const onExportAudio = async (value: any) => {
    if (!user?.activePlanUuidAndEndDate?.activePlanAmount) {
      setUpgradePlanPopup(true);
    } else if (id && audioName) {
      exportAudio(value.format, value.quality, id, uploadedFile, audioName);
    }
  };

  return (
    <div className='row'>
      <div className='col-lg-12  form-style'>
        <span>Audio</span>
        <div className='big-height record-audio mb-40 position-relative'>
          {/* eslint-disable-next-line */}
          <audio
            id='audio-player'
            ref={audioRef}
            src={uploadedFile}
            hidden
            crossOrigin='anonymous'
          />
          <img
            src={`${CLOUDINARY_URL}Images/recoding-ready.png`}
            alt='recoding-ready'
            className='img-fluid d-block mx-auto'
          />
          <AudioWave
            classString='enhance-wave'
            link={uploadedFile}
            audioLoading={audioLoading}
            setAudioLoading={setAudioLoading}
          />
          {status?.toLowerCase() !== PODCAST_STATUS.PUBLISH && !isAudioEdited && !audioLoading && (
            // eslint-disable-next-line
            <div className='edit-btn' onClick={onOpenEditor}>
              <div className='open-editor'>
                <SvgIcons iconType='edit-btn' />
                {' '}
                Open Editor
              </div>
            </div>
          )}
          {status?.toLowerCase() !== PODCAST_STATUS.PUBLISH && isAudioEdited && (
            <div className='export-audio-btn'>
              <SelectWrapper
                items={[]}
                onSelect={onExportAudio}
                placeholder='Export As'
                hasIcon
                IconName={SvgIcons}
                iconType='icon-export'
                isExportAs
                formatList={['WAV', 'MP3', 'AIFF', 'FLAC', 'AAC', 'WMA']}
                qualityList={['64 kbps', '128 kbps', '160 kbps', '320 kbps']}
              />
            </div>
          )}
          {!isEnhancing && status?.toLowerCase() !== PODCAST_STATUS.PUBLISH && !audioLoading && (
            // eslint-disable-next-line
            <span className='close-podcast' onClick={() => setDeleteModal(true)}>
              <RemoveIcon />
            </span>
          )}
        </div>

        {/* Button to enhance the audio */}
        {uploadedFile && !audioLoading && (
          <div className='enhance-btn'>
            {audioRef.current && audioRef.current?.duration <= enhanceAudioDuration ? (
              <button
                type='button'
                disabled={isEnhancing}
                className='btn-primary btn-style btn-bg audio-enh'
                onClick={uploadFileOrRecordFile}
              >
                {isEnhancing ? (
                  <div className='d-flex align-items-center justify-content-center gap-3'>
                    <Loader />
                    {enhanceMessage}
                  </div>
                ) : (
                  'Enhance Audio'
                )}
              </button>
            ) : (
              <TooltipWrapper
                tooltip={`You don't have enough limit for enhancing audio. Remaining limit ${getMinutesFromSeconds(
                  enhanceAudioDuration,
                )
                  .replace('min', 'Minutes')
                  .replace('sec', 'Seconds')}`}
                overlayProps={{ placement: 'bottom' }}
              >
                <button type='button' disabled className='btn-primary btn-style btn-bg audio-enh'>
                  Enhance Audio
                </button>
              </TooltipWrapper>
            )}
          </div>
        )}
      </div>
      {/* eslint-disable-next-line */}
      <DeleteModal
        show={deleteModal}
        closeModal={setDeleteModal}
        loading={false}
        message='Do you really want to remove this audio?'
        handleDeleteData={handleRemoveAudio}
      />
      {isOpenEditor && (
        <ModalWrapper
          size='sm'
          show={isOpenEditor}
          body={{
            title: OPEN_EDITOR.BODY.title,
            content: OPEN_EDITOR.BODY.content,
          }}
          button1={{
            children: OPEN_EDITOR.BUTTON1_CHILDREN,
            onClick: onCancelOpenEditor,
          }}
          button2={{
            children: OPEN_EDITOR.BUTTON2_CHILDREN,
            onClick: onOpenEditorOk,
          }}
          handleClose={onCancelOpenEditor}
          className='open-editor-modal'
        />
      )}

      {upgradePlanPopup && (
        <ModalWrapper
          size='lg'
          show={upgradePlanPopup}
          handleClose={() => {
            setUpgradePlanPopup(false);
          }}
          body={{
            title: 'Download Podcast',
            content: 'You need to pay extra or upgrade your plan for download podcast.',
            icon: { Element: SvgIcons, type: 'upgrade-plan' },
          }}
          button1={{
            children: 'Pay $1 For Download',
            onClick: () => {
              handlePaymentPlanAction({
                planName: 'Download Podcast',
                amount: 1,
                planFeatures: [],
                period: '',
                actionName: PLAN_ACTIONS.DOWNLOAD_RECORDED_FILE,
              });
            },
          }}
          button2={{
            children: 'Upgrade Plan',
            onClick: () => {
              navigate(`${PODCASTER.ROOT}/${APP_ROUTES.SUBSCRIPTION}`);
            },
          }}
          bodyClass='upgrade-plan-modal-body'
        />
      )}
    </div>
  );
};

EnhanceAudio.defaultProps = {
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

const mapStateToProps = (state: IState) => ({
  user: getUser(state),
});

export default connect(mapStateToProps, null)(EnhanceAudio);
