import React, {
  FC, useState, useEffect, ChangeEvent,
} from 'react';
import {
  useLocation, useParams, Link, useNavigate,
} from 'react-router-dom';

import TextAreaWrapper from '../../../components/form/TextAreaWrapper';
import ButtonWrapper from '../../../components/form/ButtonWrapper';
import APP_ROUTES, {
  PODCASTER_APP_ROUTES as PODCASTER_ROUTES,
} from '../../../constant/appRoute';
import { updateTranscriptService as updateTranscript } from '../../../services/podcaster/Transcript';
import FullPageLoader from '../../../components/Loader/FullPageLoader';

import LeftArrow from '../../../assets/svg/LeftArrow';

import '../../../assets/scss/transcript.scss';

const TranscriptPage: FC = () => {
  const navigate = useNavigate();
  const { pathname: pathName, state: locationState } = useLocation();
  const { podcastSlug, episodeId, transcriptId } = useParams();
  const [transcript, setTranscript] = useState<string>('');
  const [transcriptLength, setTranscriptLength] = useState<number>(0);
  const [s3Url, setS3Url] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTranscript = (data: string, url: string) => {
    setTranscript(data);
    setTranscriptLength(data?.length);
    setS3Url(url);
    navigate(pathName, { state: { transcriptData: data, s3Url: url } });
  };
  const handleLoading = (value: boolean) => setIsLoading(value);

  useEffect(() => {
    if (locationState) {
      const { transcriptData, s3Url } = locationState;

      handleTranscript(transcriptData, s3Url);
    } else {
      navigate(PODCASTER_ROUTES.ROOT);
    }
  }, []);

  const handleChangeTranscript = (evt: ChangeEvent<HTMLInputElement>) => {
    setTranscript(evt.target.value);
  };

  const getRowsCount = (length: number) => {
    switch (true) {
      case length < 100:
        return 2;
      case length >= 100 && length < 250:
        return 4;
      case length >= 250 && length < 400:
        return 6;
      case length >= 400 && length < 550:
        return 8;
      case length >= 550 && length < 650:
        return 10;
      case length >= 650 && length < 800:
        return 12;
      case length >= 800 && length < 950:
        return 14;
      case length >= 950 && length < 1100:
        return 16;
      case length >= 1100 && length < 1300:
        return 18;
      case length >= 1300:
        return 20;
      default:
        return 10;
    }
  };

  const handleUpdateTranscript = () => {
    handleLoading(true);
    if (transcriptId) {
      updateTranscript(
        transcriptId,
        transcript,
        s3Url,
        handleTranscript,
        handleLoading,
      );
    }
  };

  return (
    <div className='container transcript-container'>
      {isLoading && <FullPageLoader isScreenExist />}
      <div className='row'>
        <div className='col-12'>
          <div className='d-flex align-items-center justify-content-between main-div'>
            <div className='main-title d-flex align-items-center'>
              <span className='me-4 d-flex forward-btn'>
                <Link
                  to={`${PODCASTER_ROUTES.ROOT}/${podcastSlug}/${episodeId}/${APP_ROUTES.EDIT}`}
                >
                  <LeftArrow />
                </Link>
              </span>
              View Transcript
            </div>
            <ButtonWrapper
              className='view-transcript'
              onClick={handleUpdateTranscript}
            >
              Save
            </ButtonWrapper>
          </div>
        </div>
      </div>

      <TextAreaWrapper
        name='transcript'
        label=''
        className='view-transcript-text'
        value={transcript}
        onChange={handleChangeTranscript}
        rows={getRowsCount(transcript.length)}
        maxLength={transcriptLength + 500}
      />
    </div>
  );
};

export default TranscriptPage;
