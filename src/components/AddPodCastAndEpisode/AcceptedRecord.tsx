import React, { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import RemoveIcon from '../../assets/svg/RemoveIcon';
import AudioWave from './AudioWave';
import { audioEnhanceInterface } from '../../types/audioContextInterface';
import { downloadAudioFile, showToastMessage, validateHtmlTag } from '../../utils';
import { PLAN_ACTIONS, TOASTER_STATUS } from '../../constant';
import { CLOUDINARY_URL } from '../../clientConfig';
import SvgIcons from '../../assets/svg/SvgIcons';
import ModalWrapper from '../form/ModalWrapper';
import { OPEN_EDITOR } from '../../constant/modal';
import DeleteModal from '../Modal/DeleteModal';
import APP_ROUTES, { PODCASTER_APP_ROUTES as PODCASTER } from '../../constant/appRoute';
import { paymentPlanAction } from '../../services/podcaster/Subscription';
import { IStripeSecret } from '../../types';

export interface ISubscriptionSecret {
  plan: any;
  stripeSecret: IStripeSecret;
}

const API_AUDIO_BASE_URL = process.env.REACT_APP_API_AUDIO_BASE_URL;
const AcceptedRecord = ({
  setUploadedFile,
  setStage,
  enhancedAudio,
  setEnhancedAudio,
  downloadPath,
  sentiments,
  setSentiments,
  formInstance,
  handleClick,
  user,
}: audioEnhanceInterface) => {
  const navigate = useNavigate();
  const [upgradePlanPopup, setUpgradePlanPopup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);

  const handleLoading = (value: boolean) => setIsLoading(value);
  const handleDownloadAudio = async () => {
    if (!user?.activePlanUuidAndEndDate?.activePlanAmount) {
      setUpgradePlanPopup(true);
    } else if (downloadPath) {
      const donwloadUrl = `${API_AUDIO_BASE_URL}${downloadPath}`;
      const fileFormat = donwloadUrl.split('.').pop() || '';
      downloadAudioFile(fileFormat, donwloadUrl, new Date().toISOString());
    }
  };

  const [tags, setTags] = useState<string[]>(sentiments);
  const [input, setInputTag] = useState('');
  const [isOpenEditor, setIsOpenEditor] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(true);

  const focus = useRef<HTMLInputElement | null>(null);

  const handleClickOnTagDiv = () => focus && focus.current && focus.current.focus();

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    let { value } = e.currentTarget;
    if (value) {
      const trimmedInput = value?.toLocaleLowerCase()?.trim();
      if (
        (key === 'Enter' && tags?.includes(trimmedInput))
        || (key === 'Tab' && tags?.includes(trimmedInput))
      ) {
        e?.preventDefault();
        showToastMessage(TOASTER_STATUS.ERROR, 'Sentiment already exists.');
      }
      if (
        // eslint-disable-next-line
        (key === 'Enter' && trimmedInput?.length && !tags?.includes(trimmedInput)) ||
        (key === 'Tab' && trimmedInput?.length && !tags?.includes(trimmedInput))
      ) {
        e?.preventDefault();
        if (validateHtmlTag(trimmedInput)) {
          showToastMessage(TOASTER_STATUS.ERROR, 'For security reasons, HTML tags are not allowed');
        } else if (tags?.length >= 15) {
          showToastMessage(TOASTER_STATUS.ERROR, 'You can add up to 15 setiments');
        } else {
          setTags([...tags, trimmedInput]);
          setSentiments([...tags, trimmedInput]);
          setInputTag('');
        }
      }
      if (key === 'Enter') {
        value = '';
      }
    }
    if (!value) {
      if (key === 'Backspace') {
        tags.pop();
        setTags([...tags]);
        setSentiments([...tags]);
      }
    }
  };

  const onCancelOpenEditor = () => setIsOpenEditor(false);
  const onOpenEditor = () => setIsOpenEditor(true);
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

  // eslint-disable
  return (
    <div>
      <div className='row'>
        <div className='col-lg-12'>
          {/* eslint-disable-next-line */}
          <label htmlFor='podcast-title'>Audio</label>
          <div className='position-relative big-height record-audio mb-40'>
            <div className='download-last-record'>
              <div>
                <button
                  type='button'
                  className='btn-primary reject-btn w-100'
                  onClick={handleDownloadAudio}
                >
                  Download Audio
                </button>
              </div>
              {/* eslint-disable-next-line */}
              <div className='edit-btn' onClick={onOpenEditor}>
                <div className='open-editor'>
                  <SvgIcons iconType='edit-btn' />
                  {' '}
                  Open Editor
                </div>
              </div>
            </div>
            <img
              src={`${CLOUDINARY_URL}Images/recoding-ready.png`}
              alt='final-audio'
              className='img-fluid d-block mx-auto'
            />
            <AudioWave
              classString='enhance-wave'
              link={
                // eslint-disable-next-line
                enhancedAudio
                  ? enhancedAudio instanceof File
                    ? URL?.createObjectURL(enhancedAudio)
                    : enhancedAudio
                  : ''
              }
              audioLoading={audioLoading}
              setAudioLoading={setAudioLoading}
            />
            {/* eslint-disable-next-line */}
            <span
              role='button'
              tabIndex={0}
              className='close-podcast'
              onClick={() => setDeleteModal(true)}
            >
              <RemoveIcon />
            </span>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-lg-12'>
          {/* eslint-disable-next-line */}
          <label htmlFor='podcast-tags'>Sentiments</label>
          {/* eslint-disable-next-line */}
          <div
            className='tag-box flex-wrap d-flex gap-2 align-items-center mb-3'
            onClick={handleClickOnTagDiv}
          >
            {tags.map((tagName, i) => (
              <div
                className={`d-flex position-relative ${tagName.length > 50 ? 'w-100' : ''}`}
                // eslint-disable-next-line
                key={i}
              >
                <span className='tag text-truncate'>{tagName}</span>
                {/* eslint-disable-next-line */}
                <span
                  className='close-tag-text'
                  onClick={() => {
                    setTags(tags.filter((data, index) => index !== i));
                    setSentiments(tags.filter((data, index) => index !== i));
                  }}
                >
                  <RemoveIcon />
                </span>
              </div>
            ))}
            <input
              className='input-tag h-50 w-fit  m-0'
              placeholder='Enter Sentiments'
              ref={focus}
              value={input}
              onKeyDown={onKeyDown}
              onChange={(e) => setInputTag(e.target.value)}
            />
          </div>
        </div>
      </div>

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
      <DeleteModal
        show={deleteModal}
        closeModal={setDeleteModal}
        loading={false}
        message='Do you really want to remove this audio?'
        handleDeleteData={() => {
          setEnhancedAudio('');
          setUploadedFile('');
          setStage(0);
        }}
      />

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

AcceptedRecord.defaultProps = {
  AcceptedRecord: undefined,
};

export default AcceptedRecord;
