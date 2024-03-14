import React, { useState } from 'react';

import RecordAudio from '../../assets/svg/RecordAudio';
import MicrophonePermissionModal from '../Modal/PermissionModal';

const EnableRecord = ({ setStage }: { setStage: (val: number) => void }) => {
  const [showModel, setShowModel] = useState(false);

  const checkMicrophonePermission = async () => {
    try {
      if (navigator?.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (stream) {
          setStage(2);
        } else {
          setShowModel(true);
        }
      }
    } catch (error) {
      setShowModel(true);
      console.error('Error requesting microphone permission:', error);
    }
  };

  return (
    <div className='row'>
      <div className='col-lg-12 form-style'>
        {/* eslint-disable-next-line */}
        <label htmlFor='podcast-title'>Record Audio</label>
        {/* eslint-disable-next-line */}
        <div className='big-height' onClick={checkMicrophonePermission}>
          <div className='drop-zone'>
            <span className='mb-3'>
              <RecordAudio />
            </span>
            <span className='drop-zone__prompt d-block' />
            <p className='max-file mb-0 press-record'>Press Record to Start</p>
          </div>
        </div>
      </div>
      <MicrophonePermissionModal show={showModel} onHide={() => setShowModel(false)} />
    </div>
  );
};

export default EnableRecord;
