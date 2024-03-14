import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faHome, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FallBackIcon } from '../assets/svg/FallBackIcon';

const FallBack = () => {
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    // Implement exponential backoff for retries
    const nextRetryCount = retryCount + 1;
    setTimeout(() => {
      setRetryCount(nextRetryCount);
      window.location.reload();
    }, 2 ** nextRetryCount * 1000);
  };

  return (
    <div className='main-error-page d-flex flex-column align-items-center py-5 h-100v'>
      <FallBackIcon />
      <div className='mt-4 text-center'>
        <h1 className='error-title'>
          Woops!
          {' '}
          <br />
          Something went wrong :(
        </h1>
        <h2 className='error-subtitle'>Have you tried again?</h2>
        <div className='d-flex justify-content-center mt-5'>
          <button
            className='btn btn-primary w-100 btn-style w-50 ms-2 btn-bg'
            onClick={handleRetry}
            aria-label='Retry'
            type='button'
          >
            <FontAwesomeIcon icon={faRotateRight} />
            <span className='ms-2'>Try again</span>
          </button>
          <button
            className=' btn-primary w-100 btn-style w-50 ms-2 btn-bg'
            onClick={() => navigate('/dashboard')}
            type='button'
          >
            <FontAwesomeIcon icon={faHome} />
            <span className='ms-2'>Go to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FallBack;
