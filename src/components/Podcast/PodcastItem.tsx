import React from 'react';
import { useNavigate } from 'react-router-dom';
import PodcastThumbnail from '../../assets/images/DefualtPodcastThumbnail.png';
import TooltipWrapper from '../Tooltip/TooltipWrapper';

interface Iprops {
  podcast: any;
  className?: string;
}

const PodcastItem: React.FC<Iprops> = ({ podcast, className }) => {
  const navigate = useNavigate();
  return podcast?.name ? (
    // eslint-disable-next-line
    <div
      className={`${className} podcast-frame cursor-pointer`}
      onClick={() => {
        navigate(`/podcast-details/${podcast?.slugUrl}`);
      }}
      key={podcast?.uuid}
    >
      <div className='podcast-frame-image-box'>
        <img src={podcast?.podcastThumbnailImage || PodcastThumbnail} alt='' />
      </div>
      <div className='podcast-frame-title-description'>
        <TooltipWrapper tooltip={podcast?.name}>
          <h4 className='text'>{podcast?.name}</h4>
        </TooltipWrapper>
        <TooltipWrapper tooltip={podcast?.description} overlayProps={{ placement: 'auto' }}>
          <p className='text'>{podcast?.description}</p>
        </TooltipWrapper>
      </div>
    </div>
  ) : null;
};

PodcastItem.defaultProps = {
  className: '',
};

export default PodcastItem;
