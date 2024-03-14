import React, {
  ChangeEvent, FC, useEffect, useState,
} from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import AudioEditorSidebar from './AudioEditorSidebar';
import RightSectionHeader from './RightSectionHeader';
import {
  resetRenameAudio,
  updateAudioName,
  addAudioTrack,
  getEditorEpisodeList,
  addMusicTrack,
  getAudioTracks,
  resetAudioEditor,
} from '../../../redux/actions/podcaster/audioEditor';
import SvgIcons from '../../../assets/svg/SvgIcons';
import { IState } from '../../../redux/types';
import {
  getAudioControls,
  getAudioData,
  getDurationList,
  getEpisodeId,
  getMusicList,
  getRecentlyUsedMusicList,
  getRenameAudio,
  getEpisodeList,
} from '../../../redux/selectors/podcaster/audioEditor';
import AudioWaveformWrapper from './AudioWaveformWrapper.jsx';
import ModalWrapper from '../../../components/form/ModalWrapper';
import FormGroupWrapper from '../../../components/form/FormGroupWrapper';
import { AudioControl } from '../../../redux/types/audioEditor';
import DragDropFile from '../../../components/DragAndDrop/DragDropFile';
import { getAudioDuration, showToastMessage } from '../../../utils';
import IconButtonWrapper from '../../../components/IconButtonWrapper';
import { IMusicItem, IUser } from '../../../types';
import { PLAN_ACTIONS, TOASTER_STATUS } from '../../../constant';
import MusicDrawer from './MusicDrawer';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import ButtonWrapper from '../../../components/form/ButtonWrapper';
import { exportPdfReport } from '../../../services/podcaster/AudioEditor';

import '../../../assets/scss/audio-editor.scss';
import { getUser } from '../../../redux/selectors/user';
import APP_ROUTES, { PODCASTER_APP_ROUTES as PODCASTER } from '../../../constant/appRoute';
import { paymentPlanAction } from '../../../services/podcaster/Subscription';

interface IProps {
  getEpisodes: (isEditorPage: boolean, episodeId?: string) => void;
  data: any[];
  audioControls: AudioControl[];
  renameAudio: number | null;
  resetRename: (index: number, name: string) => void;
  updateAudioName: (index: number, name: string) => void;
  addAudio: (track: any) => void;
  musicList: IMusicItem[] | [];
  durationList: any[];
  addMusicTrack: (track: IMusicItem) => void;
  recentlyUsedMusicList: IMusicItem[] | [];
  episodeId: string;
  getAudioList: (episodeId: string, isEpisodeList?: boolean) => void;
  editorEpisodes: any[] | [];
  reset: () => void;
  user: IUser;
}

const AudioEditorPage: FC<IProps> = ({
  getEpisodes,
  data,
  audioControls,
  renameAudio,
  resetRename,
  updateAudioName,
  addAudio,
  musicList,
  durationList,
  addMusicTrack,
  recentlyUsedMusicList,
  episodeId,
  getAudioList,
  editorEpisodes,
  reset,
  user,
}) => {
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const [audioName, setAudioName] = useState<string>('');
  const [isAddTrackOpen, setIsAddTrackOpen] = useState<boolean>(false);
  const [isMusicDrawerOpen, setIsMusicDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generate, setGenerate] = useState<any>({
    data: null,
    hasSummary: false,
    hasTranscript: false,
  });
  const [dragDropStyle, setDragDropStyle] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [upgradePlanPopup, setUpgradePlanPopup] = useState<boolean>(false);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);

  useEffect(() => {
    if (locationState) {
      getAudioList(locationState.episodeId, true);
    } else {
      getEpisodes(true);
    }

    return () => {
      reset();
    };
  }, []);

  useEffect(() => {
    if (typeof renameAudio === 'number') {
      setAudioName(audioControls[renameAudio].name);
    } else {
      setAudioName('');
    }
  }, [renameAudio]);

  const onRenameChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setAudioName(evt.target.value);
    if (evt.target.value.length < 4 || evt.target.value.length > 255) {
      setError('Please enter a name between 4 to 255 characters');
    } else {
      setError('');
    }
  };

  const onAddTrack = (value: boolean) => setIsAddTrackOpen(value);
  const onMusicDrawer = (value: boolean) => setIsMusicDrawerOpen(value);
  const handleLoading = (value: boolean) => setIsLoading(value);
  const handleFile = async (value: File) => {
    const duration: number = await new Promise((resolve) => {
      getAudioDuration(value, (duration: number) => {
        resolve(duration);
      });
    });

    if (duration) {
      const newAudioTrack = {
        name: value.name,
        url: URL.createObjectURL(value),
        duration,
        id: data.length + 1,
      };

      addAudio(newAudioTrack);
      onAddTrack(false);
    }
  };

  const onAddMusicTrack = (track: IMusicItem) => {
    const maxDuration = Math.max(...durationList);
    if (!user?.activePlanUuidAndEndDate?.activePlanAmount) {
      setUpgradePlanPopup(true);
    } else if (track.duration <= maxDuration) {
      addMusicTrack(track);
    } else {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        `Music track duration should not be more than ${maxDuration} Seconds`,
      );
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

  const handleGenerate = (type: string, data: string) => {
    if (type === 'transcript') {
      setGenerate({
        ...generate,
        hasSummary: false,
        hasTranscript: true,
        data,
      });
    } else if (type === 'summary') {
      setGenerate({
        ...generate,
        hasSummary: true,
        hasTranscript: false,
        data,
      });
    } else {
      setGenerate({
        hasSummary: false,
        hasTranscript: false,
        data: null,
      });
    }
  };

  const onExport = () => {
    exportPdfReport(
      episodeId,
      generate.hasTranscript ? 'transcript' : 'summary',
      handleLoading,
      data[0].name,
    );
  };

  const handleDragDropStyle = (value: boolean) => setDragDropStyle(value);

  const handleRenameAudio = (audioIndex: number, name: string) => {
    if (error.length === 0) {
      updateAudioName(audioIndex, name);
      setError('');
    }
  };

  const handleResetAudioName = (audioIndex: number, name: string) => {
    resetRename(audioIndex, name);
    setError('');
  };

  return (
    <div className='editor-audio-page audio-editor-wrapper overflow-x-hidden'>
      {isLoading && <FullPageLoader isScreenExist />}
      <div className='d-flex w-100'>
        {/* Music drawer section */}
        {isMusicDrawerOpen && (
          <>
            <MusicDrawer
              musicList={musicList}
              onAddMusicTrack={onAddMusicTrack}
              recentlyUsedMusicList={recentlyUsedMusicList}
            />
            <IconButtonWrapper
              IconName={SvgIcons}
              iconType='menu-close-icon'
              className='menu-close-icon'
              onClick={() => onMusicDrawer(false)}
            />
          </>
        )}

        {/* Audio editor sidebar */}
        <AudioEditorSidebar onAddTrack={onAddTrack} onMusicDrawer={onMusicDrawer} />

        {/* Audio editor right section */}
        {data?.length > 0 && editorEpisodes?.length > 0 && (
          <div className='right-section'>
            <RightSectionHeader
              handleLoading={handleLoading}
              handleGenerate={handleGenerate}
              id={locationState ? locationState.episodeId : null}
              path={locationState ? locationState.path : null}
              podcastId={locationState ? locationState.podcastId : null}
            />

            <div className={`drag-drop ${dragDropStyle && 'drag-active'}`}>
              <DragDropFile
                accept='audio/*'
                handleFile={handleFile}
                icon={<SvgIcons iconType='icon_import' />}
                maxFileSize={50}
                width={0}
                height={0}
                content='Drag & Drop files here or'
                subContent='Click to Upload'
                isAudio
                maxDuration={data[0].duration}
                handleDragDropStyle={handleDragDropStyle}
              />
            </div>

            <div className='audio-waveform-wrapper'>
              <AudioWaveformWrapper isMusicDrawerOpen={isMusicDrawerOpen} />
            </div>
            {(generate.hasSummary || generate.hasTranscript) && (
              <div className='generated-summary'>
                <div className='d-flex align-items-center justify-content-between generated-summary-text'>
                  <div>
                    <h1 className='m-0'>
                      {generate.hasSummary && 'Generated Summary'}
                      {generate.hasTranscript && 'Generated Transcript'}
                    </h1>
                  </div>
                  {generate.data && generate.data?.length > 0 && (
                    <ButtonWrapper
                      isBaseCssRequired={false}
                      className='export-data'
                      onClick={onExport}
                    >
                      {generate.hasSummary && 'Export Summary'}
                      {generate.hasTranscript && 'Export Transcript'}
                    </ButtonWrapper>
                  )}
                </div>

                <p>
                  {generate.data && generate.data?.length > 0 ? generate.data : 'Data is not found'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Audio track rename pop up modal */}
      {typeof renameAudio === 'number' && audioControls[renameAudio].isRename && (
        <ModalWrapper
          size='sm'
          show={audioControls[renameAudio].isRename}
          handleClose={() => handleResetAudioName(renameAudio, audioControls[renameAudio].name)}
          body={{
            title: 'Rename Audio',
            content: '',
          }}
          button1={{
            children: 'Cancel',
            onClick: () => handleResetAudioName(renameAudio, audioControls[renameAudio].name),
          }}
          button2={{
            children: 'Rename',
            onClick: () => handleRenameAudio(renameAudio, audioName),
          }}
          customElement={(
            <FormGroupWrapper
              name='trackName'
              type='text'
              placeholder='Enter Audio Name'
              onChange={onRenameChange}
              value={audioName}
              error={error}
              className='position-relative'
            />
          )}
        />
      )}

      {/* New audio track pop up modal */}
      {isAddTrackOpen && data.length > 0 && (
        <ModalWrapper
          size='sm'
          show={isAddTrackOpen}
          handleClose={() => onAddTrack(false)}
          body={{
            title: 'Import Audio',
            content: '',
          }}
          button1={{
            children: '',
            onClick: () => {},
          }}
          customElement={(
            <DragDropFile
              accept='audio/*'
              handleFile={handleFile}
              icon={null}
              maxFileSize={50}
              width={0}
              height={0}
              content='Drag & Drop here OR'
              subContent='Choose File'
              isAudio
              maxDuration={data[0].duration}
            />
          )}
          isButton={false}
          className='new-audio-track'
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
            title: 'Add Music',
            content: 'You need to pay extra or upgrade your plan for add music.',
            icon: { Element: SvgIcons, type: 'upgrade-plan' },
          }}
          button1={{
            children: 'Pay $1 For Add Music',
            onClick: () => {
              handlePaymentPlanAction({
                planName: 'Add Music',
                amount: 1,
                planFeatures: [],
                period: '',
                actionName: PLAN_ACTIONS.ADD_BACKGROUND_MUSIC,
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

const mapStateToProps = (state: IState) => ({
  data: getAudioData(state),
  audioControls: getAudioControls(state),
  renameAudio: getRenameAudio(state),
  musicList: getMusicList(state),
  durationList: getDurationList(state),
  recentlyUsedMusicList: getRecentlyUsedMusicList(state),
  episodeId: getEpisodeId(state),
  editorEpisodes: getEpisodeList(state),
  user: getUser(state),
});

const mapDispatchToProps = {
  getEpisodes: getEditorEpisodeList,
  resetRename: resetRenameAudio,
  updateAudioName,
  addAudio: addAudioTrack,
  addMusicTrack,
  getAudioList: getAudioTracks,
  reset: resetAudioEditor,
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioEditorPage);
