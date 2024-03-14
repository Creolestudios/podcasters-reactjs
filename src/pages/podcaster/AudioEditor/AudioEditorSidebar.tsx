import React, { FC } from 'react';
import { connect } from 'react-redux';
import ButtonWrapper from '../../../components/form/ButtonWrapper';
import SvgIcons from '../../../assets/svg/SvgIcons';
import SidebarTrackControl from './SidebarTrackControl';
import { IState } from '../../../redux/types';
import { resetAudioSpeedTray } from '../../../redux/actions/podcaster/audioEditor';
import {
  getAudioControls,
  getAudioData,
} from '../../../redux/selectors/podcaster/audioEditor';
import { AudioControl } from '../../../redux/types/audioEditor';

interface IProps {
  data: any[];
  audioControls: AudioControl[];
  onAddTrack: (value: boolean) => void;
  onMusicDrawer: (value: boolean) => void;
  resetAudioSpeed: () => void;
}

const AudioEditorSidebar: FC<IProps> = ({
  data,
  audioControls,
  onAddTrack,
  onMusicDrawer,
  resetAudioSpeed,
}) => (
  // eslint-disable-next-line
  <div className='editor-audio-sidebar' onClick={() => resetAudioSpeed()}>
    <h1>EDITOR</h1>
    <div className='btn-wrapper'>
      <ButtonWrapper
        onClick={() => onAddTrack(true)}
        IconElement={<SvgIcons iconType='plus-icon' className='me-2' />}
      >
        New Track
      </ButtonWrapper>
    </div>
    <div className='track-list w-100'>
      {data?.length > 0
        && audioControls.length > 0
        && audioControls.map((element: any, index: number) => (
          <div
            className='track-control-wrapper'
            style={{ background: index % 2 === 0 ? '#fff' : '' }}
            key={Math.random()}
          >
            <SidebarTrackControl
              name={element.name}
              index={index}
              isMute={element.isMute}
              volumeLabel={element.volumeLabel}
              isLocked={element.isLocked}
              speed={element.speed}
              isSpeedOpen={element.isSpeedOpen}
            />
          </div>
        ))}
    </div>

    <ButtonWrapper
      onClick={() => onMusicDrawer(true)}
      IconElement={<SvgIcons iconType='plus-color' className='me-2' />}
      className='add-music p-15'
    >
      Add Music
    </ButtonWrapper>
  </div>
);

const mapStateToProps = (state: IState) => ({
  data: getAudioData(state),
  audioControls: getAudioControls(state),
});

const mapDispatchToProps = {
  resetAudioSpeed: resetAudioSpeedTray,
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioEditorSidebar);
