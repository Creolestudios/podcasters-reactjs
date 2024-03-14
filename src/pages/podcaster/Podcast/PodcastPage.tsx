import React, {
  ChangeEvent, FC, useEffect, useState,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  faCheck,
  faCircleExclamation,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import FormikWrapper from '../../../components/FormikWrapper';
import FormikUploadFileWrapper from '../../../components/FormikWrapper/FormikUploadFileWrapper';
import FormikFieldWrapper from '../../../components/FormikWrapper/FormikFieldWrapper';
import FormikSelectWrapper from '../../../components/FormikWrapper/FormikSelectWrapper';
import FormikTextAreaWrapper from '../../../components/FormikWrapper/FormikTextAreaWrapper';
import FormikTagWrapper from '../../../components/FormikWrapper/FormikTagWrapper';
import FormikCheckBox from '../../../components/FormikWrapper/FormikCheckBox';
import FormikButton from '../../../components/FormikWrapper/FormikButton';
import { podcastSchema } from '../../../utils/formValidationSchema';
import FormikDateTimeSchedule from '../../../components/FormikWrapper/FormikDateTimeSchedule';
import FormikAudioRecorderUploader from '../../../components/FormikWrapper/FormikAudioRecorderUploader';
import FormikInputGroup from '../../../components/FormikWrapper/FormikInputGroup';
import CheckBoxWrapper from '../../../components/form/CheckBoxWrapper';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import ModalWrapper from '../../../components/form/ModalWrapper';
import FeaturedPodcast from './FeaturedPodcast';
import { INITIAL_PODCAST } from '../../../constant/podcast';
import {
  getLangauges,
  getCountries,
  getAudioDuration,
  showToastMessage,
  getScheduledDateTime,
  getUuidFromOptionName,
} from '../../../utils';
import {
  getPodcastCategoriesAndTypes,
  validateSlug,
  getPodcastByUuid,
  updatePodcast,
  setFeaturedPodcast as doFeaturedPodcast,
  addPodcast,
} from '../../../services/podcaster/Podcast';
import { useDebounce } from '../../../hooks/useDebounce';
import { PODCAST_STATUS, TOASTER_STATUS } from '../../../constant';
import APP_ROUTES, { PODCASTER_APP_ROUTES } from '../../../constant/appRoute';
import { UPGRADE_PLAN } from '../../../constant/modal';
import { IPodcastOptions } from '../../../types/podcaster';
import {
  IPodcastForm,
  IPodcastUploaded,
} from '../../../types/podcastInterface';
import BackButton from '../../../components/BackButton';
import { CLOUDINARY_URL, DOMAIN_URL } from '../../../clientConfig';
import '../../../assets/scss/podcast-page.scss';
import { IUpdateCount, IUpdateUser, IUser } from '../../../types';
import { IState } from '../../../redux/types';
import { getUser } from '../../../redux/selectors/user';
import { updateUserDetailAction } from '../../../redux/actions/user';
import PopupTickMark from '../../../assets/svg/PopupTickMark';
import ButtonWrapper from '../../../components/form/ButtonWrapper';
import SvgIcons from '../../../assets/svg/SvgIcons';
import TooltipWrapper from '../../../components/Tooltip/TooltipWrapper';
import ColorStart from '../../../assets/svg/ColorStart';
import { ITag } from '../../../components/form/TagWrapper';
import Loader from '../../../components/Loader/Loader';
import { getUploadAudioDuration } from '../../../services/podcaster/Episode';

export interface IOpen {
  feature: boolean;
  upgradePlan: boolean;
}

const SlugCustomElement: FC<{ status: string }> = ({ status }) => {
  if (status === 'loading') {
    return <FontAwesomeIcon icon={faSpinner} spin />;
  }
  if (status === 'success') {
    return <FontAwesomeIcon icon={faCheck} className={status} />;
  }
  if (status === 'failure') {
    return <FontAwesomeIcon icon={faCircleExclamation} className={status} />;
  }
  return null;
};

interface IProps {
  user: IUser;
  updateUserDetailAction: (data: IUpdateUser | IUpdateCount) => Promise<void>;
}

const PodcastPage: FC<IProps> = ({ user, updateUserDetailAction }) => {
  const navigate = useNavigate();
  const { pathname, state: locationState } = useLocation();
  const [initialPodcast, setInitialPodcast] = useState<IPodcastForm>(INITIAL_PODCAST);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittingLabel, setSubmittingLabel] = useState<string>('');
  const [options, setOptions] = useState<IPodcastOptions>({
    categories: [],
    types: [],
  });
  const [slugStatus, setSlugStatus] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const debouncedSlug = useDebounce(slug, 500);
  const [hasScheduled, setHasScheduled] = useState<boolean>(false);
  const [hasAudio, setHasAudio] = useState<boolean>(false);
  const [featuredPodcast, setFeaturedPodcast] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<IOpen>({
    feature: false,
    upgradePlan: false,
  });
  const [isValidateSlug, setIsValidateSlug] = useState<boolean>(false);
  const [podcastUploaded, setPodcastUploaded] = useState<IPodcastUploaded>({
    isPodcastUploaded: false,
    podcastId: null,
  });
  const [audioRecorderUploaderStage, setAudioRecorderUploaderStage] = useState<number>(0);
  const [uploadAudioDuration, setUploadAudioDuration] = useState<number>(0);
  const [enhanceAudioDuration, setEnhanceAudioDuration] = useState<number>(0);

  const pathNameList: string[] = pathname.split('/');
  const isEdit = pathNameList.at(pathNameList.length - 1) === PODCASTER_APP_ROUTES.EDIT;

  const handlePageLoading = (value: boolean) => setIsPageLoading(value);
  const handleOptions = (value: IPodcastOptions) => setOptions(value);
  const handleSlugStatus = (value: string) => setSlugStatus(value);
  const handleSlug = (value: string) => {
    setIsValidateSlug(true);
    setSlug(value.toLowerCase());
  };

  const handleHasScheduled = () => {
    setHasScheduled(!hasScheduled);
  };

  const handlePodcast = (value: IPodcastForm) => {
    setInitialPodcast(value);
    if (isEdit) {
      setFeaturedPodcast(value.featured ?? false);
      setHasScheduled(value.status?.toLowerCase() === PODCAST_STATUS.SCHEDULE);
      setSlug(value.slugUrl);
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

  useEffect(() => {
    setInitialPodcast({
      ...initialPodcast,
      monetized: user?.monetizedAllPodcasts,
    });
  }, [user?.monetizedAllPodcasts]);

  useEffect(() => {
    handlePageLoading(true);
    getPodcastCategoriesAndTypes(handlePageLoading, handleOptions);
    if (isEdit) {
      handlePageLoading(true);
      getPodcastByUuid(
        locationState.podcastId,
        handlePageLoading,
        handlePodcast,
      );
    }
  }, []);

  useEffect(() => {
    if (user.uuid && !isEdit) {
      getUploadAudioDuration(user.uuid, handelAudioDuration);
    }
  }, [user.uuid]);

  useEffect(() => {
    if (debouncedSlug && isValidateSlug) {
      handleSlugStatus('loading');
      validateSlug(slug, handleSlugStatus);
    }
  }, [debouncedSlug]);

  const onSetHasAudio = (value: boolean) => setHasAudio(value);
  const handleValidate = () => {
    const errors: { [key: string]: string } = {};

    if (slugStatus === 'failure') {
      errors.slugUrl = 'This slug is already in use. Please choose a different one.';
    }

    return errors;
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

  const handleRedirect = (isAddUpdate?: boolean) => {
    if (isEdit) {
      navigate(PODCASTER_APP_ROUTES.ROOT);
      if (isAddUpdate) {
        showToastMessage(
          TOASTER_STATUS.SUCCESS,
          'Podcast Updated Successfully',
        );
      }
    } else {
      navigate(PODCASTER_APP_ROUTES.ROOT);
      if (isAddUpdate) {
        const data = {
          episodeCount: (user?.episodeCount || 0) + 1,
          podcastCount: (user?.podcastCount || 0) + 1,
        };
        updateUserDetailAction(data);
        showToastMessage(
          TOASTER_STATUS.SUCCESS,
          'Podcast Created Successfully',
        );
      }
    }
  };

  const handleOpen = (key: keyof IOpen) => setIsOpen({ ...isOpen, [key]: !isOpen[key] });
  const onFeaturedPodcast = (evt: ChangeEvent<HTMLInputElement>) => {
    const isChecked = evt.target.checked;

    if (isChecked && initialPodcast.upgradePlanForFeatured) {
      handleOpen('upgradePlan');
    } else {
      setFeaturedPodcast(isChecked);
      if (!isChecked) {
        doFeaturedPodcast(locationState.podcastId, false, 0, 0, handleOpen);
      } else {
        handleOpen('feature');
      }
    }
  };

  const openPodcastUploaded = (podcastId: string) => {
    setPodcastUploaded({
      isPodcastUploaded: true,
      podcastId,
    });
  };
  const redirectToAudioEditor = (
    id: string,
    podcastId: string,
    slugUrl: string,
  ) => {
    navigate(
      `${PODCASTER_APP_ROUTES.ROOT}/${PODCASTER_APP_ROUTES.CONTINUE_EDIT}`,
      {
        state: {
          episodeId: id,
          path: `${PODCASTER_APP_ROUTES.ROOT}/${slugUrl}`,
          podcastId,
        },
      },
    );
  };

  const onAddPodcast = async (values: IPodcastForm, isOpenEditor?: boolean) => {
    setIsSubmitting(true);
    const { enhancedAudio, uploadedAudio, status } = values;
    setSubmittingLabel(getSubmittingStatus(status));

    const duration: number = await new Promise((resolve) => {
      const audioFile = enhancedAudio || uploadedAudio;
      getAudioDuration(audioFile, (duration: number) => {
        resolve(duration);
      });
    });

    if (duration) {
      const {
        thumbnail,
        cover,
        podcastCategory,
        podcastType,
        podcastTitle,
        description,
        country,
        language,
        slugUrl,
        tags,
        status,
        uploadedAudio,
        enhancedAudio,
        sentimentNames,
        date,
        time,
        monetized,
        warnListeners,
        transcriptUuid,
      } = values;

      const podcast: any = {
        categoryUuid: getUuidFromOptionName(
          options.categories,
          podcastCategory,
        ),
        podcastTypeUuid: getUuidFromOptionName(options.types, podcastType),
        name: podcastTitle,
        description,
        podcastCountry: country,
        podcastLanguage: language,
        tagNames: tags.map((tag: ITag) => tag.value),
        episodeTagNames: [],
        podcastStatus: status?.toUpperCase(),
        slugUrl,
        monetized,
        warnListeners,
        episodeSentiments: sentimentNames,
        scheduledDate: getScheduledDateTime(date, time),
        podcastDuration: duration,
        audioFile: enhancedAudio ? 'PROCESSED' : 'RECORDED',
        transcriptUuid,
        recorderAudioFile: uploadedAudio.replace(CLOUDINARY_URL ?? '', ''),
        processedAudioFile: (enhancedAudio as string).replace(
          CLOUDINARY_URL ?? '',
          '',
        ),
      };

      await addPodcast(
        podcast,
        thumbnail,
        cover,
        handleRedirect,
        handlePageLoading,
        openPodcastUploaded,
        isOpenEditor,
        redirectToAudioEditor,
      );
    }
    setIsSubmitting(false);
  };

  const onViewUpgradePlan = () => {
    handleOpen('upgradePlan');
    navigate(`${PODCASTER_APP_ROUTES.ROOT}/${APP_ROUTES.SUBSCRIPTION}`);
  };

  const handleSubscriptionPlanClose = () => {
    setFeaturedPodcast(false);
    handleOpen('upgradePlan');
  };

  const handleFeatureClose = () => {
    setFeaturedPodcast(false);
    handleOpen('feature');
  };

  const onUpdatePodcast = async (values: any) => {
    setIsSubmitting(true);
    setSubmittingLabel(getSubmittingStatus(values.status));
    await updatePodcast(
      values,
      locationState.podcastId,
      handleRedirect,
      handlePageLoading,
      options,
      initialPodcast.status.toLowerCase(),
    );
    setIsSubmitting(false);
  };

  const setTitleIntoSlug = (value: string) => {
    setIsValidateSlug(true);
    const slugValue = value
      .replace(/[^a-zA-Z\s]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();

    setSlug(
      slugValue.substring(0, 50).at(-1) === '-'
        ? slugValue.substring(0, 49)
        : slugValue.substring(0, 50),
    );
  };

  const onNoPodcastUploaded = () => {
    setPodcastUploaded({
      isPodcastUploaded: false,
      podcastId: null,
    });
    navigate(PODCASTER_APP_ROUTES.ROOT);
  };

  const onYesPodcastUploaded = () => {
    navigate(
      `${PODCASTER_APP_ROUTES.ROOT}/${slug}/${PODCASTER_APP_ROUTES.ADD_EPISODE}`,
      {
        state: { podcastId: podcastUploaded.podcastId },
      },
    );
  };

  const handleAudioRecorderUploaderStage = (value: number) => setAudioRecorderUploaderStage(value);

  return (
    <div className='container podcast-page'>
      {isPageLoading && <FullPageLoader isScreenExist />}
      <BackButton
        text={isEdit ? 'Edit Podcast' : 'Add Podcast'}
        onClick={handleRedirect}
      />

      <FormikWrapper
        initialValues={initialPodcast}
        validationSchema={podcastSchema}
        button={{
          className: '',
          children: '',
          isHide: true,
        }}
        onSubmit={(values: any) => (isEdit ? onUpdatePodcast(values) : onAddPodcast(values))}
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
              disabled={
                initialPodcast.status.toLowerCase() === PODCAST_STATUS.PUBLISH
              }
              required
            />
            <FormikUploadFileWrapper
              columns='col-lg-10'
              accept='image/png, image/jpeg'
              maxFileSize={10}
              height={400}
              width={1600}
              label='Cover'
              name='cover'
              disabled={
                initialPodcast.status.toLowerCase() === PODCAST_STATUS.PUBLISH
              }
              required
            />
          </div>
        </div>
        <div className='row form-margin'>
          <div className='col-lg-6'>
            <FormikFieldWrapper
              label='Podcast Title'
              name='podcastTitle'
              type='text'
              placeholder='Enter Title'
              disabled={
                initialPodcast.status.toLowerCase() === PODCAST_STATUS.PUBLISH
              }
              handleChange={setTitleIntoSlug}
              required
              validateOnChange={{ length: true }}
            />
            <FormikInputGroup
              label='Slug Url'
              name='slugUrl'
              textValue={DOMAIN_URL ?? ''}
              type='text'
              customElement={
                slug !== '' ? <SlugCustomElement status={slugStatus} /> : null
              }
              handleChange={handleSlug}
              disabled={
                initialPodcast.status.toLowerCase() === PODCAST_STATUS.PUBLISH
              }
              value={slug}
              hasValue
              required
            />
            <div className='row podcast-select from-group-wrapper'>
              <div className='col-lg-6 podcast-select-column'>
                <FormikSelectWrapper
                  name='podcastCategory'
                  label='Podcast Category'
                  options={options.categories}
                  selectsuggestion='Select Category'
                  className='mb-0'
                  disabled={
                    initialPodcast.status.toLowerCase()
                    === PODCAST_STATUS.PUBLISH
                  }
                  required
                />
              </div>
              <div className='col-lg-6 podcast-select-column'>
                <FormikSelectWrapper
                  name='podcastType'
                  label='Podcast Type'
                  options={options.types}
                  selectsuggestion='Select Type'
                  className='mb-0'
                  disabled={
                    initialPodcast.status.toLowerCase()
                    === PODCAST_STATUS.PUBLISH
                  }
                  required
                />
              </div>
            </div>
            <div className='row podcast-select from-group-wrapper'>
              <div className='col-lg-6 podcast-select-column'>
                <FormikSelectWrapper
                  name='country'
                  label='Country of Origin'
                  options={getCountries()}
                  selectsuggestion='Select Country'
                  className='mb-0'
                  disabled={
                    initialPodcast.status.toLowerCase()
                    === PODCAST_STATUS.PUBLISH
                  }
                  required
                />
              </div>
              <div className='col-lg-6 podcast-select-column'>
                <FormikSelectWrapper
                  name='language'
                  label='Language'
                  options={getLangauges()}
                  selectsuggestion='Select Language'
                  className='mb-0'
                  disabled={
                    initialPodcast.status.toLowerCase()
                    === PODCAST_STATUS.PUBLISH
                  }
                  required
                />
              </div>
            </div>
            <div className='podcast-select'>
              <div className='podcast-select-column'>
                <FormikTextAreaWrapper
                  label='Description'
                  name='description'
                  placeholder='Type Description...'
                  required
                />
              </div>
            </div>
            <FormikTagWrapper
              name='tags'
              label='Tags'
              placeholder='Enter Tags'
            />
            <div className='row'>
              <div className='col-lg-6'>
                <FormikCheckBox
                  name='monetized'
                  label='Monetize this podcast'
                />
              </div>
              {isEdit && (
                <div className='col-lg-6'>
                  <CheckBoxWrapper
                    name='featured'
                    label='Make it Featured'
                    customElement={(
                      <span className='m-l-5'>
                        <ColorStart />
                      </span>
                    )}
                    checked={featuredPodcast}
                    onChange={onFeaturedPodcast}
                    id='featured'
                  />
                </div>
              )}
            </div>
            <div className='warn-listener'>
              <FormikCheckBox
                name='warnListeners'
                label='Warn listeners about language or illegal content'
                disabled={
                  initialPodcast.status.toLowerCase() === PODCAST_STATUS.PUBLISH
                }
              />
              {initialPodcast.status.toLowerCase()
                === PODCAST_STATUS.PUBLISH && (
                <TooltipWrapper
                  tooltip='The podcast has already been published, and you cannot make any changes to it.'
                  overlayProps={{ placement: 'top' }}
                >
                  <SvgIcons iconType='information-icon' />
                </TooltipWrapper>
              )}
            </div>
          </div>
          {!isEdit && (
            <div className='col-lg-6'>
              <div className='form-style'>
                <FormikAudioRecorderUploader
                  onSetHasAudio={onSetHasAudio}
                  uploadedAudio={initialPodcast.uploadedAudio}
                  status={initialPodcast.status}
                  handleSubmit={onAddPodcast}
                  handleAudioRecorderUploaderStage={
                    handleAudioRecorderUploaderStage
                  }
                  setIsProcessing={(value: boolean) => setIsProcessing(value)}
                  uploadAudioDuration={uploadAudioDuration}
                  enhanceAudioDuration={enhanceAudioDuration}
                  refetchLimits={() => getUploadAudioDuration(user.uuid, handelAudioDuration)}
                />
              </div>
            </div>
          )}
        </div>

        {(hasAudio || isEdit)
          && !isProcessing
          && initialPodcast.status.toLowerCase() !== PODCAST_STATUS.PUBLISH
          && audioRecorderUploaderStage !== 4 && (
            <div className='row form-margin date-time-schedular mt-25'>
              <div className='col-lg-6'>
                <p className='when-publish'>When do you want to publish?</p>
                <FormikDateTimeSchedule
                  handleHasScheduled={handleHasScheduled}
                  name='status'
                  isScheduled={hasScheduled}
                  isSubmitting={isSubmitting}
                  isCancelHide={
                    initialPodcast.status.toLowerCase()
                    === PODCAST_STATUS.SCHEDULE
                  }
                />
              </div>
            </div>
        )}

        {!isSubmitting ? (
          audioRecorderUploaderStage !== 4 && (
            <div className='row'>
              <div className='col-lg-6'>
                <div
                  className={`form-margin form-btn ${
                    isEdit && 'position-relative'
                  }`}
                >
                  {!hasScheduled && hasAudio && !isProcessing && !isEdit && (
                    <>
                      <FormikButton
                        name='status'
                        value='draft'
                        type='submit'
                        className='reject-btn'
                      >
                        Save as Draft
                      </FormikButton>
                      <FormikButton
                        name='status'
                        value='published'
                        type='submit'
                      >
                        Publish
                      </FormikButton>
                    </>
                  )}

                  {isEdit
                    && !hasScheduled
                    && initialPodcast.status.toLowerCase()
                      !== PODCAST_STATUS.DRAFT && (
                      <FormikButton
                        name='status'
                        value={initialPodcast.status}
                        type='submit'
                        className={
                          initialPodcast.status.toLowerCase()
                          !== PODCAST_STATUS.PUBLISH
                            ? 'edit-save-btn'
                            : ''
                        }
                      >
                        Save
                      </FormikButton>
                  )}

                  {initialPodcast.status.toLowerCase()
                    !== PODCAST_STATUS.PUBLISH
                    && isEdit
                    && (!hasScheduled
                      || initialPodcast.status.toLowerCase()
                        === PODCAST_STATUS.SCHEDULE) && (
                        <FormikButton
                          name='status'
                          value='published'
                          type='submit'
                          className='edit-save-btn'
                        >
                          Publish
                        </FormikButton>
                  )}
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

      {isOpen.feature && (
        <ModalWrapper
          size='lg'
          show={isOpen.feature}
          handleClose={handleFeatureClose}
          body={{
            title: 'Featured Podcast',
            content: 'Select the dates when you want to featured',
          }}
          button1={{
            children: '',
            onClick: () => {},
          }}
          customElement={(
            <FeaturedPodcast
              podcastId={locationState.podcastId}
              featured={featuredPodcast}
              handleOpen={handleOpen}
            />
          )}
          isButton={false}
        />
      )}

      {isOpen.upgradePlan && (
        <ModalWrapper
          size='lg'
          show={isOpen.upgradePlan}
          handleClose={handleSubscriptionPlanClose}
          body={{
            title: UPGRADE_PLAN.BODY.title,
            content: UPGRADE_PLAN.BODY.content,
            icon: UPGRADE_PLAN.BODY.icon,
          }}
          button1={{
            children: UPGRADE_PLAN.BUTTON1_CHILDREN,
            onClick: onViewUpgradePlan,
          }}
          bodyClass='upgrade-plan-modal-body'
        />
      )}

      {podcastUploaded.isPodcastUploaded && (
        <ModalWrapper
          size='lg'
          show={podcastUploaded.isPodcastUploaded}
          handleClose={onNoPodcastUploaded}
          body={{
            title: 'Podcast Successfully uploaded',
            content: '',
            icon: { Element: PopupTickMark },
          }}
          button1={{
            children: '',
            onClick: () => {},
          }}
          customElement={(
            <div className='add-more-episodes'>
              <p>Do you want to add more episodes?</p>
              <div className='btn-container'>
                <ButtonWrapper
                  onClick={onNoPodcastUploaded}
                  className='reject-btn'
                >
                  No
                </ButtonWrapper>
                <ButtonWrapper onClick={onYesPodcastUploaded}>
                  Yes
                </ButtonWrapper>
              </div>
            </div>
          )}
          className='podcast-uploaded-modal'
          isButton={false}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  user: getUser(state),
});

const mapDispatchToProps = {
  updateUserDetailAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PodcastPage);
