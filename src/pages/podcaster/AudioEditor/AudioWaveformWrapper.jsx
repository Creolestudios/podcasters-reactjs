/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import wavesurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import {
  duplicateAudioTrack,
  muteAudioTrack,
  setPlayAudioTrack,
  splitAudio,
  setRenameAudio,
  unmuteAudioTrack,
  deleteAudioTrack,
  dragAudioTrack,
} from '../../../redux/actions/podcaster/audioEditor';
import {
  getAudioData,
  getDurationList,
  getAudioPlayTrack,
  getAudioControls,
} from '../../../redux/selectors/podcaster/audioEditor';
import IconButtonWrapper from '../../../components/IconButtonWrapper';
import SvgIcons from '../../../assets/svg/SvgIcons';
import ActionMenuWrapper from '../../../components/Dropdown/ActionMenuWrapper';
import MenuIcon from '../../../assets/svg/MenuIcon';
import { WAVE_ACTION_MENU_ITEMS } from '../../../constant';
import PlayIcon from '../../../assets/svg/PlayIcon';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import CloseIcon from '../../../assets/svg/CloseIcon';
import { autoGenerateAudioName, getMinutesFromSeconds } from '../../../utils';
import RangeSlider from '../../../components/RangeSlider';

import '../../../assets/scss/audio-editor.scss';

const AudioWaveformWrapper = ({
  data,
  durationList,
  setPlayAudioTrack,
  currentTrack,
  duplicate,
  split,
  muteAudioTrack,
  audioControls,
  setRename,
  unmuteAudioTrack,
  deleteAudioTrack,
  dragAudio,
  isMusicDrawerOpen,
}) => {
  const [audioObjects, setAudioObjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLineWidth, setTimeLineWidth] = useState(null);
  const audioProcessingRef = useRef();
  const [audioPlayer, setAudioPlayer] = useState({
    isPlay: false,
    volume: '0.5',
    speed: '1',
  });

  useEffect(() => {
    const initializeOrUpdateAudioObject = (dataElement, index) => {
      const episodeAudioObject =
        audioObjects && audioObjects?.length > 0 && index === 0
          ? audioObjects[0]
          : false;

      const audioObject =
        episodeAudioObject ||
        wavesurfer.create({
          container: `#wave-${index}`,
          backend: 'MediaElement',
          scrollParent: true,
          autoCenter: true,
          cursorColor: 'transparent',
          loopSelection: true,
          waveColor: '#A1A5DF',
          progressColor: '#9244eb',
          responsive: true,
          barWidth: 2,
          barHeight: 1,
          barGap: 4,
          normalize: true,
          plugins: getWaveformPlugins(dataElement),
        });

      if (!episodeAudioObject) {
        audioObject.load(dataElement.url);
      }

      audioObject.on('ready', () => {
        initializeWaveform(audioObject, index);
      });

      audioObject.on('finish', () => {
        handleAudioFinish(index);
      });

      return audioObject;
    };

    const getWaveformPlugins = (dataElement) => {
      const plugins = [
        RegionsPlugin.create({
          width: '50px',
        }),
      ];
      if (dataElement.duration === Math.max(...durationList)) {
        plugins.unshift(
          TimelinePlugin.create({
            container: '#timeline',
            primaryLabelInterval: 1,
            formatTimeCallback: (second) => {
              const sec_num = parseInt(second, 10);
              let hours = Math.floor(sec_num / 3600);
              let minutes = Math.floor((sec_num - hours * 3600) / 60);
              let seconds = sec_num - hours * 3600 - minutes * 60;

              if (hours < 10) {
                hours = '0' + hours;
              }
              if (minutes < 10) {
                minutes = '0' + minutes;
              }
              if (seconds < 10) {
                seconds = '0' + seconds;
              }
              if (hours > 0) {
                return hours + ':' + minutes + ':' + seconds;
              } else {
                return minutes + ':' + seconds;
              }
            },
            timeInterval: 2.0,
            secondaryLabelInterval: 1,
            style: {
              border: '0px',
            },
          })
        );
      }
      return plugins;
    };

    const initializeWaveform = (audioObject, index) => {
      audioObject.addRegion({
        id: 'addRegion',
        start: 0.0,
        end: 2.0,
        color: 'hsla(265, 100%, 86%, 0.4)',
      });

      audioObject.setVolume(audioControls[index].volumeLabel);
      audioObject.setPlaybackRate(audioControls[index].speed, true);

      if (audioObject.timeline) {
        setTimeLineWidth(
          audioObject.timeline.container.children[0].scrollWidth
        );
      }
    };

    const handleAudioFinish = (index) => {
      setPlayAudioTrack({
        isPlay: false,
        index: index,
      });
    };

    const newAudioObjects = data.map((dataElement, index) =>
      initializeOrUpdateAudioObject(dataElement, index)
    );

    // Update or add new audio objects
    setAudioObjects([...newAudioObjects]);

    return () => {
      newAudioObjects.forEach((audioObject, index) => {
        if (index !== 0) {
          audioObject.destroy();
        }
      });
    };
  }, [data]);

  const setWaveWidth = () => {
    const waveContainerElements = document.querySelectorAll('.wave-container');

    if (
      waveContainerElements.length > 0 &&
      audioObjects.length > 0 &&
      timeLineWidth
    ) {
      waveContainerElements.forEach((element, index) => {
        if (Math.max(...durationList) === durationList[index]) {
          waveContainerElements[index].children[1].style.width = '100%';
        } else {
          const width =
            (timeLineWidth / Math.max(...durationList)) * durationList[index];

          element.style.width = `${width}px`;
        }
      });
    }

    const regionElements = document.querySelectorAll('.wavesurfer-region');
    regionElements.forEach((element) => {
      element.style.width = '20px';
    });
  };

  useEffect(() => {
    if (durationList.length > 0) {
      setWaveWidth();
    }
  }, [durationList, audioObjects, timeLineWidth]);

  useEffect(() => {
    if (audioControls.length === audioObjects.length) {
      audioControls.forEach((controlElement, index) => {
        if (audioObjects[index].isReady) {
          audioObjects[index].setVolume(controlElement.volumeLabel);
          audioObjects[index].setPlaybackRate(controlElement.speed, true);
        } else {
          audioObjects[index].on('ready', () => {
            audioObjects[index].setVolume(controlElement.volumeLabel);
            audioObjects[index].setPlaybackRate(controlElement.speed, true);
          });
        }
      });
    }
  }, [audioControls, audioObjects]);

  const handlePlayPause = (index) => {
    const audioObject = audioObjects[index];
    audioObject.playPause();
    setPlayAudioTrack({
      isPlay: audioObject.isPlaying(),
      index: audioObject.isPlaying() ? index : null,
    });
  };

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  const createWavBuffer = (pcmArrays, numberOfChannels, sampleRate, length) => {
    const wavData = new DataView(
      new ArrayBuffer(44 + length * numberOfChannels * 2)
    );

    writeString(wavData, 0, 'RIFF');
    wavData.setUint32(4, 32 + length * numberOfChannels * 2, true);
    writeString(wavData, 8, 'WAVE');
    writeString(wavData, 12, 'fmt ');
    wavData.setUint32(16, 16, true);
    wavData.setUint16(20, 1, true);
    wavData.setUint16(22, numberOfChannels, true);
    wavData.setUint32(24, sampleRate, true);
    wavData.setUint32(28, sampleRate * 2 * numberOfChannels, true);
    wavData.setUint16(32, numberOfChannels * 2, true);
    wavData.setUint16(34, 16, true);
    writeString(wavData, 36, 'data');
    wavData.setUint32(40, length * numberOfChannels * 2, true);

    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < numberOfChannels; j++) {
        const value = pcmArrays[j][i];
        wavData.setInt16(offset, value * 0x7fff, true);
        offset += 2;
      }
    }

    return wavData.buffer;
  };

  const getBlobFromAudioBuffer = (buffer) => {
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const length = buffer.length;
    const pcmArrays = [];

    for (let channel = 0; channel < numberOfChannels; channel++) {
      pcmArrays.push(buffer.getChannelData(channel));
    }

    const wavBuffer = createWavBuffer(
      pcmArrays,
      numberOfChannels,
      sampleRate,
      length
    );
    return new Blob([wavBuffer], { type: 'audio/wav' });
  };

  const handleSplit = async (selectedRegion, audioObject, index) => {
    // Get the start and end points of the selected region
    const selectedStart = selectedRegion.start;
    const selectedEnd = selectedRegion.end;

    // Get the audio buffer
    const audioBuffer = audioObject.backend.buffer;

    // Calculate the split point index based on the selected region
    const splitSelectedStartPointIndex = Math.floor(
      selectedStart * audioBuffer.sampleRate
    );
    const splitSelectedEndPointIndex = Math.floor(
      selectedEnd * audioBuffer.sampleRate
    );

    // Ensure split points are within bounds
    const maxIndex = audioBuffer.length * audioBuffer.numberOfChannels;
    const safeSplitSelectedStartPointIndex = Math.min(
      splitSelectedStartPointIndex,
      maxIndex
    );
    const safeSplitSelectedEndPointIndex = Math.min(
      splitSelectedEndPointIndex,
      maxIndex
    );

    // Calculate the split length
    const splitSelectedPointIndex =
      safeSplitSelectedEndPointIndex - safeSplitSelectedStartPointIndex;

    // Create buffers for selected parts
    const secondPartBuffer = audioObject.backend.ac.createBuffer(
      audioBuffer.numberOfChannels,
      splitSelectedPointIndex,
      audioBuffer.sampleRate
    );

    // Copy data to the selected part buffer
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const audioChannelData = audioBuffer.getChannelData(channel);
      const selectedRegionChannelData =
        secondPartBuffer.getChannelData(channel);

      selectedRegionChannelData.set(
        audioChannelData.subarray(
          safeSplitSelectedStartPointIndex,
          safeSplitSelectedEndPointIndex
        )
      );
    }

    const selectedRegionBlob = await getBlobFromAudioBuffer(secondPartBuffer);
    const selectedRegionUrl = URL.createObjectURL(selectedRegionBlob);

    if (selectedRegionUrl) {
      const _dataElement = {
        name: autoGenerateAudioName(data[index].name, data),
        url: selectedRegionUrl,
        duration: Number((selectedEnd - selectedStart).toFixed(2)),
      };
      split({
        dataElement: _dataElement,
        index,
      });
    }
  };

  const onSplit = (index) => {
    if (audioObjects.length > 0) {
      const audioObject = audioObjects[index];
      const regions = audioObject.regions.list;

      if (Object.keys(regions).length > 0) {
        const selectedRegion = audioObject.regions.list.addRegion;

        if (selectedRegion) {
          handleSplit(selectedRegion, audioObject, index);
        }
      }
    }
  };

  const onDownload = (index) => {
    if (audioObjects.length > 0) {
      const audioObject = audioObjects[index];
      const audioBuffer = audioObject.backend.buffer;
      const numberOfChannels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const length = audioBuffer.length;
      const pcmArrays = [];

      for (let channel = 0; channel < numberOfChannels; channel++) {
        pcmArrays.push(audioBuffer.getChannelData(channel));
      }

      const wavBuffer = createWavBuffer(
        pcmArrays,
        numberOfChannels,
        sampleRate,
        length
      );

      const audioBlob = new Blob([wavBuffer], { type: 'audio/wav' });
      const downloadLink = document.createElement('a');

      downloadLink.href = window.URL.createObjectURL(audioBlob);
      downloadLink.download = `${data[index].name}.wav`;
      document.body.appendChild(downloadLink);
      downloadLink.click();

      document.body.removeChild(downloadLink);
    }
  };

  const onMuteAudio = (index) => {
    const audioObject = audioObjects[index];
    audioObject.setVolume(0);

    muteAudioTrack(index);
  };

  const handleAction = (type, index, audioDataObject = {}) => {
    const modifiedType = type?.toLowerCase();
    if (modifiedType === 'duplicate') {
      duplicate(index);
    } else if (modifiedType === 'split') {
      onSplit(index);
    } else if (modifiedType === 'download') {
      onDownload(index);
    } else if (modifiedType === 'mute') {
      onMuteAudio(index);
    } else if (modifiedType === 'rename') {
      setRename(index, data[index].name);
    } else if (modifiedType === 'unmute') {
      unmuteAudioTrack(index);
    } else if (modifiedType === 'delete') {
      deleteAudioTrack(index);
    }
  };

  const onPlayerPlay = () => {
    const lastPosition = audioObjects[0].timeline.drawer.lastPos;
    const duration = data[0].duration;
    const perSecWidth = timeLineWidth / duration;
    const audioTrackStartTimeList = data.map(
      (item, index) =>
        (audioControls[index].startPosition - lastPosition) / perSecWidth
    );
    const timeOutIds = [];

    setAudioPlayer({ ...audioPlayer, isPlay: true });
    audioObjects.forEach((audioObject, index) => {
      timeOutIds.push(
        setTimeout(() => {
          audioObject.play();
        }, audioTrackStartTimeList[index] * 1000)
      );
    });

    audioObjects[0].on('pause', () => {
      timeOutIds.forEach((timeOutId) => {
        clearTimeout(timeOutId);
      });
    });

    audioObjects[0].on('audioprocess', () => {
      const currentTime = getMinutesFromSeconds(
        parseInt(audioObjects[0].getCurrentTime()),
        'mm:ss'
      );
      const totalTime = getMinutesFromSeconds(
        parseInt(audioObjects[0].getDuration()),
        'mm:ss'
      );
      audioProcessingRef.current.innerText = `${currentTime} / ${totalTime}`;
      const divControl1 =
        document.getElementById('wave-0')?.firstChild?.firstChild?.style;
      const divControl = document.getElementsByClassName(
        'audio-waveform-section'
      )[0]?.style;
      divControl.setProperty('--timeLftPosition', `${divControl1?.width}`);

      // Change Master player timeline z index when three dot menu open to eliminate overlapping on it
      const divControlWidth = Number(divControl1?.width.split('px')[0]);
      const actionMenuElements = Array.from(
        document.querySelectorAll('.action-menu')
      );
      const isActionMenuOpen = actionMenuElements.filter((element) =>
        element.className.includes('show')
      );

      if (
        divControlWidth > 55 &&
        divControlWidth < 215 &&
        isActionMenuOpen.length > 0
      ) {
        divControl.setProperty('--zIndex', 0);
      } else {
        divControl.setProperty('--zIndex', 5);
      }

      // scroll audio track auto when timeline bar of master player at end of the view port width of the screen
      document.getElementsByClassName('audio-waveform-section')[0].scrollLeft =
        divControlWidth + 10 - audioObjects[0]?.container?.clientWidth;
    });

    audioObjects[0].on('finish', () => {
      audioProcessingRef.current.innerText = '';
      setAudioPlayer({ ...audioPlayer, isPlay: false });
    });
  };

  const onPlayerPause = () => {
    audioObjects.forEach((audioObject, index) => {
      audioObject.pause();
    });
    setAudioPlayer({ ...audioPlayer, isPlay: false });
  };

  const onPlayerVolumeControl = (value) => {
    setAudioPlayer({ ...audioPlayer, volume: value });
    audioObjects.forEach((audioObject) => {
      audioObject.setVolume(Number(value));
    });
  };

  const onPlayerSpeedControl = (value) => {
    audioObjects.forEach((audioObject) => {
      audioObject.setPlaybackRate(Number(value), true);
    });
    setAudioPlayer({ ...audioPlayer, speed: value });
  };

  const onDragStop = (index, position) => {
    const perSecWidth = timeLineWidth / Math.max(...durationList);
    const startTime = position / perSecWidth;
    dragAudio(index, position, startTime);
  };

  const handleActionMenu = (value) => {
    const divControl = document.getElementsByClassName(
      'audio-waveform-section'
    )[0]?.style;

    if (value) {
      divControl.setProperty('--zIndex', 0);
    } else {
      divControl.setProperty('--zIndex', 5);
    }
  };

  return (
    <>
      {/* Audio waveform container */}
      <div className='audio-waveform-container'>
        {isLoading && <FullPageLoader isScreenExist />}
        <section className='audio-waveform-section position-relative'>
          <div id='timeline' />
          <div className='wave-wrapper '>
            {data?.map((element, index) => (
              <div
                key={index}
                className={`wave-main-container ${
                  audioControls[index].isLocked ? 'event-disabled' : ''
                } ${
                  audioControls[index].isMute ||
                  audioControls[index]?.volumeLabel === 0
                    ? 'event-mute'
                    : ''
                }`}
              >
                <Draggable
                  axis='x'
                  bounds={{ left: 0, right: index === 0 ? 0 : timeLineWidth }}
                  onStop={(evt, data) => onDragStop(index, data.x)}
                  defaultPosition={{
                    x: audioControls[index].startPosition,
                    y: 0,
                  }}
                >
                  <div className='wave-container'>
                    <div className='wave-actions'>
                      <IconButtonWrapper
                        IconName={
                          currentTrack.isPlay && currentTrack.index === index
                            ? SvgIcons
                            : PlayIcon
                        }
                        iconType={
                          currentTrack.isPlay && currentTrack.index === index
                            ? 'small-pause-audio'
                            : ''
                        }
                        onClick={() => handlePlayPause(index)}
                        className='wave-icon zoom'
                      />
                      <ActionMenuWrapper
                        MenuIcon={MenuIcon}
                        items={WAVE_ACTION_MENU_ITEMS}
                        slugId=''
                        id='id'
                        hasDivider={false}
                        onClick={(type) => handleAction(type, index)}
                        conditionalItem={{
                          key: audioControls[index].isMute ? 'Unmute' : 'Mute',
                          value: audioControls[index].isMute,
                          actionItemKey: 'volume',
                          iconType: audioControls[index].isMute
                            ? 'volume'
                            : 'vector',
                          IconName: SvgIcons,
                        }}
                        disabled={{
                          delete: index === 0 ? true : false,
                          rename: index === 0 ? true : false,
                        }}
                        checkActionMenuIsOpen={handleActionMenu}
                      />
                    </div>
                    <div id={`wave-${index}`} className='wave' />
                  </div>
                </Draggable>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Audio Player Section */}
      <div
        className={`editor-audioPlayer ${
          isMusicDrawerOpen ? 'drawer-width' : 'editor-width'
        }`}
      >
        {/* Left player block */}
        <div className='left-player-block'>
          <IconButtonWrapper
            IconName={SvgIcons}
            iconType={audioPlayer.isPlay ? 'white-pause' : 'white-play'}
            onClick={audioPlayer.isPlay ? onPlayerPause : onPlayerPlay}
          />
          <span
            className='audio-processing-duration'
            ref={audioProcessingRef}
          />
        </div>

        {/* Right player block */}
        <div className='right-player-block'>
          <div className='block'>
            <div className='sub-block'>
              <span>SPEED</span>
              <span>
                <SvgIcons iconType='white-speed' />
              </span>
              <span>
                <RangeSlider
                  value={audioPlayer.speed}
                  onChange={onPlayerSpeedControl}
                  id='playerSpeed'
                  leftProgressColor='#E2F952'
                  rightProgressColor='#ccc'
                  min={0.25}
                  max={2}
                  step={0.25}
                />
              </span>
              <span className='block-value'>{audioPlayer.speed} x</span>
            </div>
          </div>
          <div className='block'>
            <div className='sub-block'>
              <span>VOLUME</span>
              <span className='volume-control'>
                <SvgIcons
                  iconType={
                    audioPlayer.volume === '0' ? 'white-mute' : 'white-volume'
                  }
                />
              </span>
              <span>
                <RangeSlider
                  value={audioPlayer.volume}
                  onChange={onPlayerVolumeControl}
                  id='playerVolume'
                  leftProgressColor='#E2F952'
                  rightProgressColor='#ccc'
                  min={0}
                  max={1}
                  step={0.1}
                />
              </span>
              <span className='block-value'>{audioPlayer.volume * 100} %</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  data: getAudioData(state),
  durationList: getDurationList(state),
  currentTrack: getAudioPlayTrack(state),
  audioControls: getAudioControls(state),
});

const mapDispatchToProps = {
  setPlayAudioTrack,
  duplicate: duplicateAudioTrack,
  split: splitAudio,
  muteAudioTrack: muteAudioTrack,
  setRename: setRenameAudio,
  unmuteAudioTrack,
  deleteAudioTrack,
  dragAudio: dragAudioTrack,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioWaveformWrapper);
