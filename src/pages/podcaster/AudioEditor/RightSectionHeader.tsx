import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SelectWrapper from '../../../components/Dropdown/SelectWrapper';
import ButtonWrapper from '../../../components/form/ButtonWrapper';
import IconButtonWrapper from '../../../components/IconButtonWrapper';
import {
  getAudioControls,
  getAudioData,
  getEpisodeList,
  getEpisodeId,
  getDeletedTracks,
  getHistory,
} from '../../../redux/selectors/podcaster/audioEditor';
import {
  getAudioTracks,
  undoAudioTrack,
  resetAudioSpeedTray,
} from '../../../redux/actions/podcaster/audioEditor';
import {
  saveEpisodeTracksInDraft,
  getTranscriptByEpisodeUuid,
  finalizeAudio,
} from '../../../services/podcaster/AudioEditor';
import { IState } from '../../../redux/types';
import { ISelectItem, IUser } from '../../../types';
import APP_ROUTES, {
  PODCASTER_APP_ROUTES as PODCASTER_ROUTES,
  PODCASTER_APP_ROUTES as PODCASTER,
} from '../../../constant/appRoute';

import SvgIcons from '../../../assets/svg/SvgIcons';
import '../../../assets/scss/audio-editor.scss';
import { truncateContentWithEllipsis } from '../../../utils';
import { getUser } from '../../../redux/selectors/user';
import ModalWrapper from '../../../components/form/ModalWrapper';
import { paymentPlanAction } from '../../../services/podcaster/Subscription';
import { PLAN_ACTIONS } from '../../../constant';

interface IProps {
  editorEpisodes: any;
  getAudios: (id: string) => void;
  data: any[];
  audioControls: any[];
  episodeId: string;
  handleLoading: (value: boolean) => void;
  deletedTracks: string[] | [];
  undo: () => void;
  history: any;
  handleGenerate: (type: string, data: string) => void;
  id: string | null;
  path: string | null;
  podcastId: string | null;
  resetSidebarAudioSpeed: () => void;
  user: IUser;
}

const RightSectionHeader: FC<IProps> = ({
  editorEpisodes,
  getAudios,
  data,
  audioControls,
  episodeId,
  handleLoading,
  deletedTracks,
  undo,
  history,
  handleGenerate,
  id,
  path,
  podcastId,
  resetSidebarAudioSpeed,
  user,
}) => {
  const navigate = useNavigate();
  const [upgradePlanPopup, setUpgradePlanPopup] = useState<boolean>(false);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);

  const handleGetAudios = () => {
    getAudios(episodeId);
  };

  const getEditorEpisodes = () => {
    const items = editorEpisodes.map((episode: any) => ({
      label: episode.episodeName,
      value: episode.episodeName,
      key: episode.uuid,
    }));

    return items;
  };

  const onDraft = () => {
    handleLoading(true);
    saveEpisodeTracksInDraft(
      episodeId,
      data,
      deletedTracks,
      audioControls,
      handleLoading,
      handleGetAudios,
    );
  };

  const onGenerate = (value: string) => {
    if (!user?.activePlanUuidAndEndDate?.activePlanAmount) {
      if (value === 'summary') {
        setUpgradePlanPopup(true);
      } else {
        handleLoading(true);
        getTranscriptByEpisodeUuid(
          episodeId,
          handleGenerate,
          handleLoading,
          value,
        );
      }
    }
  };

  const handleEpisode = (value: ISelectItem) => {
    handleGenerate('', '');
    getAudios(value.key ?? '');
  };

  const redirect = () => {
    if (path) {
      navigate(`${path}/${id}/${PODCASTER_ROUTES.EDIT}`, {
        state: {
          podcastId,
          editedAudio: true,
          audioName: data[0].name,
        },
      });
    } else {
      const editorEpisode = editorEpisodes.find(
        (item: any) => item.uuid === episodeId,
      );

      navigate(
        `${PODCASTER_ROUTES.ROOT}/${editorEpisode.slugUrl}/${episodeId}/${PODCASTER_ROUTES.EDIT}`,
        {
          state: {
            podcastId: editorEpisode.podcastUuid,
            editedAudio: true,
            audioName: data[0].name,
          },
        },
      );
    }
  };

  const onFinalize = () => {
    handleLoading(true);
    finalizeAudio(episodeId, data, audioControls, handleLoading, redirect);
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

  return (
    // eslint-disable-next-line
    <div
      className='d-flex justify-content-between editor-audio-menu w-100 flex-wrap'
      onClick={() => resetSidebarAudioSpeed()}
    >
      <div className='project-select'>
        <div className='d-flex'>
          {editorEpisodes?.length > 0 && (
            <SelectWrapper
              items={getEditorEpisodes()}
              onSelect={handleEpisode}
              placeholder={
                !id
                  ? truncateContentWithEllipsis(
                    editorEpisodes[0].episodeName,
                    17,
                  )
                  : truncateContentWithEllipsis(
                    editorEpisodes?.find((item: any) => item.uuid === id)
                      ?.episodeName,
                    17,
                  )
              }
              hasSearch
              hasBoarder={false}
              isDisabled
            />
          )}
          <div className='border-right-b-d' />
          <div className='d-flex'>
            <IconButtonWrapper
              IconName={SvgIcons}
              iconType='undo'
              onClick={() => undo()}
              isDisabled={Object.keys(history).length === 0}
            />
          </div>
        </div>
      </div>
      <div className='d-flex flex-wrap right-btn-wrapper'>
        <div className='me-3 mb-3 d-flex'>
          <SelectWrapper
            items={[
              {
                label: 'Summary',
                value: 'summary',
                icon: <SvgIcons iconType='icon-export' />,
              },
              {
                label: 'Transcript',
                value: 'transcript',
                icon: <SvgIcons iconType='copy' />,
              },
            ]}
            onSelect={onGenerate}
            placeholder='Generate'
            hasIcon
            IconName={SvgIcons}
            iconType='generate'
          />
          <ButtonWrapper onClick={onDraft} className='save-as-draft me-3'>
            Save As Draft
          </ButtonWrapper>
          <ButtonWrapper onClick={onFinalize}>Finalize Audio</ButtonWrapper>
        </div>
      </div>
      {upgradePlanPopup && (
        <ModalWrapper
          size='lg'
          show={upgradePlanPopup}
          handleClose={() => {
            setUpgradePlanPopup(false);
          }}
          body={{
            title: 'Generate Summary',
            content:
              'You need to pay extra or upgrade your plan for generate summary.',
            icon: { Element: SvgIcons, type: 'upgrade-plan' },
          }}
          button1={{
            children: 'Pay $1 For Generate Summary',
            onClick: () => {
              handlePaymentPlanAction({
                planName: 'Generate Summary',
                amount: 1,
                planFeatures: [],
                period: '',
                actionName: PLAN_ACTIONS.GENERATE_SUMMARY,
              });
            },
            className: 'p-14',
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
  editorEpisodes: getEpisodeList(state),
  data: getAudioData(state),
  audioControls: getAudioControls(state),
  episodeId: getEpisodeId(state),
  deletedTracks: getDeletedTracks(state),
  history: getHistory(state),
  user: getUser(state),
});

const mapDispatchToProps = {
  getAudios: getAudioTracks,
  undo: undoAudioTrack,
  resetSidebarAudioSpeed: resetAudioSpeedTray,
};

export default connect(mapStateToProps, mapDispatchToProps)(RightSectionHeader);
