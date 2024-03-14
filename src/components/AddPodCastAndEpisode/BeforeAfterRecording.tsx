import React, { useRef, useState } from 'react';
import { BeforeAfterRecordingInterface } from '../../types/audioContextInterface';

import AudioWave from './AudioWave';
import RemoveIcon from '../../assets/svg/RemoveIcon';
import { CLOUDINARY_URL } from '../../clientConfig';
import { showToastMessage, validateHtmlTag } from '../../utils';
import { TOASTER_STATUS } from '../../constant';
import Loader from '../Loader/Loader';

const BeforeAfterRecording = ({
  setStage,
  uploadedFile,
  enhancedAudio,
  setSentiments,
  sentiments,
  audioType,
  handleAudioChange,
  setEnhancedAudio,
  isUploading,
  uploadProcess,
}: BeforeAfterRecordingInterface) => {
  const [tags, setTags] = useState<string[]>(sentiments);
  const [input, setInputTag] = useState('');
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
        (key === 'Enter' &&
          trimmedInput?.length
          && !tags?.includes(trimmedInput))
        || (key === 'Tab' && trimmedInput?.length && !tags?.includes(trimmedInput))
      ) {
        e?.preventDefault();
        if (validateHtmlTag(trimmedInput)) {
          showToastMessage(
            TOASTER_STATUS.ERROR,
            'For security reasons, HTML tags are not allowed',
          );
        } else if (tags?.length >= 15) {
          showToastMessage(
            TOASTER_STATUS.ERROR,
            'You can add up to 15 sentiments',
          );
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

  const handleEnhancedAudio = () => {
    if (typeof enhancedAudio === 'object') {
      handleAudioChange(enhancedAudio, true);
    }
  };

  const handleRejectAudio = () => {
    setEnhancedAudio('');
    if (audioType === 'uploaded') {
      setStage(0);
    } else {
      setStage(3);
    }
  };

  return (
    <div className='row'>
      <div className='col-lg-12'>
        <div className='big-height record-audio mb-4 position-relative'>
          <img
            src={`${CLOUDINARY_URL}Images/before-audio.png`}
            alt='before-audio'
            className='img-fluid d-block mx-auto'
          />
          <AudioWave
            classString='enhance-wave'
            color='befor'
            link={uploadedFile}
            audioLoading={audioLoading}
            setAudioLoading={setAudioLoading}
          />
        </div>
        <div className='big-height record-audio mb-4 position-relative'>
          <img
            src={`${CLOUDINARY_URL}Images/after-audio.png`}
            alt='after-audio'
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
                  className={`d-flex position-relative ${
                    tagName.length > 50 ? 'w-100' : ''
                  }`}
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
                className='input-tag h-50 w-fit m-0'
                placeholder='Enter Sentiments'
                ref={focus}
                value={input}
                onKeyDown={onKeyDown}
                onChange={(e) => setInputTag(e.target.value)}
              />
            </div>
          </div>
        </div>
        {!isUploading ? (
          <div className='enhance-btn d-flex'>
            <button
              type='button'
              className='btn btn-primary btn-style reject-btn w-50 me-2'
              onClick={handleRejectAudio}
            >
              Reject
            </button>
            <button
              type='button'
              className='btn btn-primary btn-style w-50 ms-2 btn-bg'
              onClick={handleEnhancedAudio}
            >
              Accept
            </button>
          </div>
        ) : (
          <button
            type='button'
            disabled
            className='btn btn-primary btn-style w-100 ms-2 btn-bg gap-3'
          >
            <Loader />
            Getting Audio (
            {uploadProcess}
            %)
          </button>
        )}
      </div>
    </div>
  );
};
export default BeforeAfterRecording;
