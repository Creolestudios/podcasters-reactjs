import React, { FC, useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import FormikWrapper from '../../../components/FormikWrapper';
import FormikUploadFileWrapper from '../../../components/FormikWrapper/FormikUploadFileWrapper';
import FormikFieldWrapper from '../../../components/FormikWrapper/FormikFieldWrapper';
import FormikTextAreaWrapper from '../../../components/FormikWrapper/FormikTextAreaWrapper';
import FormikSelectWrapper from '../../../components/FormikWrapper/FormikSelectWrapper';
import FormikTagWrapper from '../../../components/FormikWrapper/FormikTagWrapper';
import FormikAudioRecorderUploader from '../../../components/FormikWrapper/FormikAudioRecorderUploader';
import FormikDateTimeSchedule from '../../../components/FormikWrapper/FormikDateTimeSchedule';
import {
  getRequiredText,
  episodeSchema,
} from '../../../utils/formValidationSchema';
import {
  getAudioDuration,
  getCountries,
  getScheduledDateTime,
  showToastMessage,
} from '../../../utils';
import {
  getEpisodeDetail,
  updateEpisode,
  addEpisode,
  getUploadAudioDuration,
} from '../../../services/podcaster/Episode';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import BackButton from '../../../components/BackButton';
import { INITIAL_ADD_EPISODE } from '../../../constant/podcast';
import { PODCASTER_APP_ROUTES } from '../../../constant/appRoute';

import FormikButton from '../../../components/FormikWrapper/FormikButton';
import { PODCAST_STATUS, TOASTER_STATUS } from '../../../constant';

import { IEpisode, IEpisodeForm } from '../../../types/episodeDataInterface';
import {
  ITranscript, IUpdateCount, IUpdateUser, IUser,
} from '../../../types';
import '../../../assets/scss/episode-page.scss';
import { IState } from '../../../redux/types';
import { getUser } from '../../../redux/selectors/user';
import {
  updateUserDetailAction,
  getEditorEpisodeCount,
} from '../../../redux/actions/user';
import { CLOUDINARY_URL } from '../../../clientConfig';
import Loader from '../../../components/Loader/Loader';

export interface IForm {
  thumbnail: string;
  cover: string;
  episodeNo: string;
  episodeTitle: string;
  description: string;
  hasScheduled: boolean;
  date: string;
  time: string;
}

interface IProps {
  user: IUser;
  updateUserDetailAction: (data: IUpdateUser | IUpdateCount) => Promise<void>;
  getEditorEpisodeCount: () => void;
}

const EpisodePage: FC<IProps> = ({
  user,
  updateUserDetailAction,
  getEditorEpisodeCount,
}) => {
  const { state, pathname } = useLocation();
  const navigate = useNavigate();
  const [hasScheduled, setHasScheduled] = useState<boolean>(false);
  const [hasAudio, setHasAudio] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittingLabel, setSubmittingLabel] = useState<string>('');
  const [initialEpisode, setInitialEpisode] = useState<IEpisodeForm>(INITIAL_ADD_EPISODE);
  const [transcript, setTranscript] = useState<ITranscript>({
    transcriptData: '',
    s3Url: '',
    uuid: '',
  });
  const [audioRecorderUploaderStage, setAudioRecorderUploaderStage] = useState<number>(0);
  const [uploadAudioDuration, setUploadAudioDuration] = useState<number>(0);
  const [enhanceAudioDuration, setEnhanceAudioDuration] = useState<number>(0);

  const pathNameList: string[] = pathname.split('/');
  const isEdit = pathNameList.at(pathNameList.length - 1) === PODCASTER_APP_ROUTES.EDIT;

  const handlePageLoading = (value: boolean) => setIsPageLoading(value);

  const handleEpisode = (value: IEpisodeForm) => {
    setInitialEpisode(value);
    if (isEdit) {
      setHasScheduled(value.status?.toLowerCase() === PODCAST_STATUS.SCHEDULE);
    }
  };

  const handelAudioDuration = (data: {
    totalAllowedEnhanced: number;
    totalAllowedUpload: number;
    usedEnhanced: number;
    usedUpload: number;
  }) => {
    setUploadAudioDuration(data.totalAllowedUpload - data.usedUpload);
    setEnhanceAudioDuration(data.totalAllowedEnhanced - data.usedEnhanced);
  };

  const getSubmittingStatus = (status: string) => {
    switch (status) {
      case PODCAST_STATUS.DRAFT:
        return 'Saving as draft';

      case PODCAST_STATUS.SCHEDULE:
        return 'Scheduling';

      case PODCAST_STATUS.PUBLISH:
        return 'Publishing';

      default:
        return 'Saving';
    }
  };

  const handleTranscript = (transcriptData: ITranscript) => setTranscript(transcriptData);

  useEffect(() => {
    if (isEdit) {
      handlePageLoading(true);
      getEpisodeDetail(
        pathNameList[pathNameList.length - 2],
        handlePageLoading,
        handleEpisode,
        handleTranscript,
      );

      if (state && state.editedAudio) {
        getEditorEpisodeCount();
      }
    } else {
      handleEpisode(INITIAL_ADD_EPISODE);
      handlePageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user.uuid) {
      getUploadAudioDuration(user.uuid, handelAudioDuration);
    }
  }, [user.uuid]);

  const handleHasScheduled = () => {
    setHasScheduled(!hasScheduled);
  };

  const onSetHasAudio = (value: boolean) => setHasAudio(value);

  const handleRedirect = (isAddUpdate?: boolean) => {
    if (isEdit) {
      navigate(`/${pathNameList.slice(1, 3).join('/')}`);
      if (isAddUpdate) {
        showToastMessage(
          TOASTER_STATUS.SUCCESS,
          'Episode Updated Successfully',
        );
      }
    } else {
      navigate(`/${pathNameList.slice(1, pathNameList.length - 1).join('/')}`);
      if (isAddUpdate) {
        const data = { episodeCount: (user?.episodeCount || 0) + 1 };
        updateUserDetailAction(data);
        showToastMessage(
          TOASTER_STATUS.SUCCESS,
          'Episode Created Successfully',
        );
      }
    }
  };

  const handleValidate = (values: IEpisodeForm) => {
    const errors: { [key: string]: string } = {};

    if (hasScheduled && values.date === '') {
      errors.date = getRequiredText('Date');
    }

    if (hasScheduled && values.time === '') {
      errors.time = getRequiredText('Time');
    }

    if (typeof values.episodeNo === 'string') {
      errors.time = 'Episode number should be number only';
    }

    if (typeof values.episodeNo === 'string' && values.episodeNo === '') {
      errors.episodeNo = 'Please enter a valid positive integer for the episode number';
    }

    return errors;
  };

  const redirectToAudioEditor = (id: string) => {
    const pathNameList = pathname.split('/');

    navigate(
      `${PODCASTER_APP_ROUTES.ROOT}/${PODCASTER_APP_ROUTES.CONTINUE_EDIT}`,
      {
        state: {
          episodeId: id,
          path:
            pathNameList.at(-1) === PODCASTER_APP_ROUTES.EDIT
              ? `${PODCASTER_APP_ROUTES.ROOT}/${pathNameList.at(2)}`
              : `${PODCASTER_APP_ROUTES.ROOT}/${pathNameList.at(-2)}`,
          podcastId: state.podcastId,
        },
      },
    );
  };

  const onEpisode = async (values: IEpisodeForm, isOpenEditor?: boolean) => {
    const {
      enhancedAudio,
      uploadedAudio,
      episodeCountry,
      episodeNo,
      episodeTitle,
      sentimentNames,
      status,
      thumbnail,
      time,
      description,
      tags,
      cover,
      date,
      transcriptUuid,
    } = values;

    setIsSubmitting(true);
    setSubmittingLabel(getSubmittingStatus(status));

    const duration: number = await new Promise((resolve) => {
      const audioFile = enhancedAudio || uploadedAudio;
      getAudioDuration(audioFile, (duration: number) => {
        resolve(duration);
      });
    });

    if (duration) {
      const episode: IEpisode = {
        name: episodeTitle,
        description,
        duration,
        episodeNo,
        publishStatus: status?.toUpperCase(),
        scheduledDate: getScheduledDateTime(date, time),
        sentimentNames,
        tagNames: tags.map((tag) => tag.value),
        audioFile: enhancedAudio ? 'PROCESSED' : 'RECORDED',
        podcastUuid: state.podcastId,
        episodeCountry,
        transcriptUuid,
        recorderAudioFile: uploadedAudio.replace(CLOUDINARY_URL ?? '', ''),
        processedAudioFile: (enhancedAudio as string).replace(
          CLOUDINARY_URL ?? '',
          '',
        ),
      };

      if (isEdit) {
        await updateEpisode(
          episode,
          thumbnail,
          cover,
          handleRedirect,
          handlePageLoading,
          pathname,
          isOpenEditor,
          redirectToAudioEditor,
        );
      } else {
        await addEpisode(
          episode,
          thumbnail,
          cover,
          handleRedirect,
          handlePageLoading,
          isOpenEditor,
          redirectToAudioEditor,
        );
      }
    }
    setIsSubmitting(false);
  };

  const customElement = () => (
    <div className='view-transcript'>
      <Link
        to={`${pathname}/${transcript.uuid}`}
        state={{
          s3Url: transcript.s3Url,
          transcriptData: transcript.transcriptData,
        }}
      >
        View Transcript
      </Link>
    </div>
  );

  const handleAudioRecorderUploaderStage = (value: number) => setAudioRecorderUploaderStage(value);

  return (
    <div className='container episode-page'>
      <BackButton
        text={isEdit ? 'Edit Episode' : 'Add Episode'}
        onClick={handleRedirect}
        isShow={initialEpisode.transcriptStatus?.toLowerCase() === 'success'}
        customElement={customElement()}
      />

      {isPageLoading ? (
        <Loader />
      ) : (
        <FormikWrapper
          initialValues={initialEpisode}
          validationSchema={episodeSchema}
          button={{
            className: '',
            children: '',
            isHide: true,
          }}
          onSubmit={(values: IEpisodeForm) => onEpisode(values)}
          validate={handleValidate}
        >
          <div className='row form-margin'>
            <div className='row pe-0 mb-30'>
              <FormikUploadFileWrapper
                columns='col-lg-2'
                accept='image/png, image/jpeg'
                maxFileSize={500}
                sizeIn='KB'
                height={3000}
                width={3000}
                label='Thumbnail'
                name='thumbnail'
                required
                disabled={
                  initialEpisode.status.toLowerCase() === PODCAST_STATUS.PUBLISH
                }
              />
              <FormikUploadFileWrapper
                columns='col-lg-10'
                accept='image/png, image/jpeg'
                maxFileSize={10}
                height={400}
                width={1600}
                label='Cover'
                name='cover'
                required
                disabled={
                  initialEpisode.status.toLowerCase() === PODCAST_STATUS.PUBLISH
                }
              />
            </div>
          </div>
          <div className='row form-margin'>
            <div className='col-lg-6'>
              <FormikFieldWrapper
                label='Episode No.'
                name='episodeNo'
                type='number'
                placeholder=''
                required
              />
              <FormikFieldWrapper
                label='Title'
                name='episodeTitle'
                type='text'
                placeholder='Enter Title'
                required
                disabled={
                  initialEpisode.status.toLowerCase() === PODCAST_STATUS.PUBLISH
                }
              />
              <FormikTextAreaWrapper
                label='Description'
                name='description'
                placeholder='Type Description...'
                required
              />
              <FormikTagWrapper
                name='tags'
                label='Tags'
                placeholder='Enter Tags'
              />
              <div className='col-lg-6 m-b-25'>
                <FormikSelectWrapper
                  name='episodeCountry'
                  label='Country of Origin'
                  options={getCountries()}
                  selectsuggestion='Enter country of origin'
                  required
                  disabled={
                    initialEpisode.status.toLowerCase()
                    === PODCAST_STATUS.PUBLISH
                  }
                />
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='form-style'>
                <FormikAudioRecorderUploader
                  onSetHasAudio={onSetHasAudio}
                  uploadedAudio={initialEpisode.uploadedAudio}
                  status={initialEpisode.status}
                  handleSubmit={onEpisode}
                  handleAudioRecorderUploaderStage={
                    handleAudioRecorderUploaderStage
                  }
                  isAudioEdited={
                    state && state.editedAudio && state.editedAudio !== null
                      ? state.editedAudio
                      : false
                  }
                  id={isEdit ? pathname.split('/')?.at(-2) : null}
                  audioName={
                    state && Object.keys(state).includes('audioName')
                      ? state.audioName
                      : null
                  }
                  redirectToAudioEditor={redirectToAudioEditor}
                  setIsProcessing={(value: boolean) => setIsProcessing(value)}
                  uploadAudioDuration={uploadAudioDuration}
                  enhanceAudioDuration={enhanceAudioDuration}
                  refetchLimits={() => getUploadAudioDuration(user.uuid, handelAudioDuration)}
                />
              </div>
            </div>
          </div>
          {hasAudio
            && !isProcessing
            && initialEpisode.status.toLowerCase() !== PODCAST_STATUS.PUBLISH
            && audioRecorderUploaderStage !== 4 && (
              <div className='row form-margin date-time-schedular'>
                <div className='col-lg-6'>
                  <p className='when-publish'>When do you want to publish?</p>
                  <FormikDateTimeSchedule
                    handleHasScheduled={handleHasScheduled}
                    name='status'
                    isScheduled={hasScheduled}
                    isCancelHide={
                      initialEpisode.status.toLowerCase()
                      === PODCAST_STATUS.SCHEDULE
                    }
                    isSubmitting={isSubmitting}
                  />
                </div>
              </div>
          )}

          {!isSubmitting ? (
            hasAudio
            && !isProcessing
            && audioRecorderUploaderStage !== 4 && (
              <div className='row'>
                <div className='col-lg-6'>
                  <div className='form-margin form-btn'>
                    {initialEpisode.status.toLowerCase()
                      !== PODCAST_STATUS.PUBLISH
                      && !hasScheduled && (
                        <FormikButton
                          name='status'
                          value='draft'
                          type='submit'
                          className='reject-btn'
                        >
                          Save as Draft
                        </FormikButton>
                    )}
                    <FormikButton name='status' value='published' type='submit'>
                      Publish
                    </FormikButton>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className='row'>
              <div className='col-lg-3 form-btn'>
                <FormikButton
                  name='loading'
                  value='loading'
                  type='button'
                  className='gap-2 w-100'
                  isDisabled
                >
                  <Loader />
                  {submittingLabel}
                </FormikButton>
              </div>
            </div>
          )}
        </FormikWrapper>
      )}
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  user: getUser(state),
});

const mapDispatchToProps = {
  updateUserDetailAction,
  getEditorEpisodeCount,
};

export default connect(mapStateToProps, mapDispatchToProps)(EpisodePage);
