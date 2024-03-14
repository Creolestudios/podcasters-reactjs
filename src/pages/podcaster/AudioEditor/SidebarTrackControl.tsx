import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import IconWrapper from '../../../components/IconWrapper';
import IconButtonWrapper from '../../../components/IconButtonWrapper';
import RangeSlider from '../../../components/RangeSlider';
import SvgIcons from '../../../assets/svg/SvgIcons';
import {
  muteAudioTrack,
  unmuteAudioTrack,
  setVolumeLabel,
  setRenameAudio,
  lockAudioTrack,
  setAudioSpeed,
  openAudioSpeed,
} from '../../../redux/actions/podcaster/audioEditor';
import '../../../assets/scss/audio-editor.scss';

interface IProps {
  name: string;
  index: number;
  isMute: boolean;
  volumeLabel: number;
  muteAudio: (index: number) => void;
  unmuteAudio: (index: number) => void;
  setVolume: (index: number, value: number | string) => void;
  setRename: (index: number, name: string) => void;
  lockAudio: (index: number, value: boolean) => void;
  isLocked: boolean;
  speed: number;
  setSpeed: (index: number, value: number) => void;
  openSpeed: (index: number, value: boolean) => void;
  isSpeedOpen: boolean;
}

const SidebarTrackControl: React.FC<IProps> = ({
  name,
  index,
  isMute,
  volumeLabel,
  muteAudio,
  unmuteAudio,
  setVolume,
  setRename,
  lockAudio,
  isLocked,
  speed,
  setSpeed,
  openSpeed,
  isSpeedOpen,
}) => {
  const handleVolume = (value: string) => {
    setVolume(index, Number(value));
  };

  const handleSpeed = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    openSpeed(index, !isSpeedOpen);
  };

  return (
    // eslint-disable-next-line
    <div className='track-block' onClick={() => openSpeed(index, false)}>
      <div className='track-text d-flex justify-content-between align-items-center'>
        <div className='audio-track-name flex-grow-1'>{name}</div>
        <div className='d-flex flex-grow-0'>
          <div className='audio-speed-wrapper'>
            <Button
              type='button'
              className={`btn-primary btn-style icon-btn audio-speed-btn ${
                isLocked && 'event-disabled'
              }`}
              onClick={handleSpeed}
            >
              <IconWrapper IconName={SvgIcons} iconType='speed-icon' />
            </Button>
            {isSpeedOpen && (
              <div className='audio-speed-modal'>
                <div className='container'>
                  <div className='speed'>Speed</div>
                  <div className='horizontal'>
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(
                      (element: number) => (
                        // eslint-disable-next-line
                        <div
                          key={element}
                          className={
                            element === speed ? 'vertical active' : 'vertical'
                          }
                          onClick={(evt: any) => {
                            evt.stopPropagation();
                            setSpeed(index, element);
                          }}
                        />
                      ),
                    )}
                  </div>
                  <div className='speed-value'>
                    {speed === 1 ? 'Normal' : `${speed}x`}
                  </div>
                </div>
              </div>
            )}
          </div>
          <IconButtonWrapper
            IconName={SvgIcons}
            iconType='icon-edit'
            onClick={() => setRename(index, name)}
            className={isLocked || index === 0 ? 'event-disabled' : ''}
          />
        </div>
      </div>
      <div className='d-flex align-items-center justify-content-between'>
        <div className='d-flex align-items-center'>
          {isLocked ? (
            <IconButtonWrapper
              IconName={SvgIcons}
              iconType='icon-lock'
              onClick={() => lockAudio(index, false)}
            />
          ) : (
            <IconButtonWrapper
              IconName={SvgIcons}
              iconType='unlock'
              onClick={() => lockAudio(index, true)}
            />
          )}
          {isMute || volumeLabel === 0 ? (
            <IconButtonWrapper
              IconName={SvgIcons}
              iconType='volume-mute'
              onClick={() => unmuteAudio(index)}
              className={isLocked ? 'event-disabled' : ''}
            />
          ) : (
            <IconButtonWrapper
              IconName={SvgIcons}
              iconType='volume'
              onClick={() => muteAudio(index)}
              className={isLocked ? 'event-disabled' : ''}
            />
          )}
        </div>

        <div className={`m-l-5 ${isLocked && 'event-disabled'}`}>
          <RangeSlider
            value={String(volumeLabel)}
            onChange={handleVolume}
            id={`slider-${index}`}
            disabled={isMute}
            leftProgressColor='#797BA1'
            rightProgressColor='#ccc'
            min={0}
            max={1}
            step={0.1}
          />
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  muteAudio: muteAudioTrack,
  unmuteAudio: unmuteAudioTrack,
  setVolume: setVolumeLabel,
  setRename: setRenameAudio,
  lockAudio: lockAudioTrack,
  setSpeed: setAudioSpeed,
  openSpeed: openAudioSpeed,
};

export default connect(null, mapDispatchToProps)(SidebarTrackControl);
