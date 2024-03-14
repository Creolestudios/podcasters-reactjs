import React from 'react';
import SvgIcons from '../../../assets/svg/SvgIcons';
import ButtonWrapper from '../../../components/form/ButtonWrapper';

interface IProps {
  title: string;
  description: string;
  onClick: () => void;
  iconType: string;
}

const DistributionCard: React.FC<IProps> = ({
  iconType, title, description, onClick,
}) => (
  <div>
    <div className='platforms-block text-center'>
      <SvgIcons iconType={iconType} />
      <h3>{title}</h3>
      <p>{description}</p>
      <ButtonWrapper className='btn-bg mx-auto' onClick={onClick}>
        Distribute
      </ButtonWrapper>
    </div>
  </div>
);

export default DistributionCard;
