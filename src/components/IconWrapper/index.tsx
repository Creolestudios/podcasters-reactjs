import React from 'react';

interface IProps {
  iconType?: string;
  IconName: any;
}

const IconWrapper: React.FC<IProps> = ({ IconName, iconType }) => (iconType === '' ? <IconName /> : <IconName iconType={iconType} />);

IconWrapper.defaultProps = {
  iconType: '',
};

export default IconWrapper;
