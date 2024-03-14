import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CopyToClipboard from 'react-copy-to-clipboard';
import SvgIcons from '../../../assets/svg/SvgIcons';
import BackButton from '../../../components/BackButton';
import DistributionCard from './DistributionCard';
import { TOASTER_STATUS } from '../../../constant';
import { showToastMessage } from '../../../utils';
import ButtonWrapper from '../../../components/form/ButtonWrapper';
import { API_URL } from '../../../clientConfig';
import '../../../assets/scss/podcast-distribution.scss';
import { PODCAST_API_ROUTES } from '../../../constant/apiRoute';

const DistributionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <BackButton
              text='Distributions'
              onClick={() => {
                navigate(-1);
              }}
            />
          </div>
        </div>

        <div className='row'>
          <div className='col-lg-6'>
            <div className='steps-you'>
              <p className='mb-0'>Steps you need to follow</p>
              <div className='history-tl-container'>
                <ul className='tl'>
                  <li>
                    <h5>Step 1</h5>
                    <p>Copy above link</p>
                  </li>
                  <li className='step2'>
                    <h5>Step 2</h5>
                    <p>Use the copied link to list your podcasts on preferred platform.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='col-lg-6'>
            <div className='steps-you copy-links form-style'>
              <p>Copy Distribution Link</p>
              <div className='position-relative'>
                <input
                  type='text'
                  className='form-control mt-4 mb-4'
                  id='podcast-title'
                  placeholder='Enter Title'
                  name='name'
                  value={`${API_URL}${PODCAST_API_ROUTES.GET_PODCAST_RSS}/${location?.state?.podcastSlug}`}
                />
                <CopyToClipboard
                  text={`${API_URL}${PODCAST_API_ROUTES.GET_PODCAST_RSS}/${location?.state?.podcastSlug}`}
                  onCopy={() => {
                    showToastMessage(TOASTER_STATUS.SUCCESS, 'Link Copied Successfully');
                  }}
                >
                  <ButtonWrapper className='copy-url-links'>
                    <SvgIcons iconType='copy-icon' />
                  </ButtonWrapper>
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-lg-4'>
            <DistributionCard
              iconType='google-podcast'
              title='Google Podcast'
              description='Distributes on Google Podcast'
              onClick={() => {
                window.open('https://podcastsmanager.google.com/add-feed', '_blank');
              }}
            />
          </div>
          <div className='col-lg-4'>
            <DistributionCard
              iconType='apple-podcast'
              title='Apple Podcast'
              description='Distributes on Apple Podcast'
              onClick={() => {
                window.open('https://podcastsconnect.apple.com/my-podcasts', '_blank');
              }}
            />
          </div>
          <div className='col-lg-4'>
            <DistributionCard
              iconType='amazon-podcast'
              title='Amazon Music'
              description='Distributes on Amazon Music'
              onClick={() => {
                window.open('https://podcasters.amazon.com/submit-rss', '_blank');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionsPage;
