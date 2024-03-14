import React from 'react';

const DeleteIcon = ({ height, width }: { height?: number; width?: number }) => (
  <svg
    width={width || 40}
    height={height || 40}
    viewBox='0 0 40 40'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='img-fluid d-block mx-auto'
  >
    <path
      d='M31.666 11.6665C31.224 11.6665 30.8001 11.8421 30.4875 12.1547C30.1749 12.4672 29.9993 12.8911 29.9993 13.3332V31.9848C29.9515 32.8276 29.5726 33.6174 28.9452 34.1821C28.3177 34.7469 27.4925 35.0408 26.6493 34.9998H13.3493C12.5062 35.0408 11.681 34.7469 11.0535 34.1821C10.4261 33.6174 10.0472 32.8276 9.99935 31.9848V13.3332C9.99935 12.8911 9.82375 12.4672 9.51119 12.1547C9.19863 11.8421 8.77471 11.6665 8.33268 11.6665C7.89065 11.6665 7.46673 11.8421 7.15417 12.1547C6.84161 12.4672 6.66602 12.8911 6.66602 13.3332V31.9848C6.71359 33.7119 7.44365 35.3497 8.69632 36.5396C9.94898 37.7294 11.6221 38.3744 13.3493 38.3332H26.6493C28.3766 38.3744 30.0497 37.7294 31.3024 36.5396C32.555 35.3497 33.2851 33.7119 33.3327 31.9848V13.3332C33.3327 12.8911 33.1571 12.4672 32.8445 12.1547C32.532 11.8421 32.108 11.6665 31.666 11.6665Z'
      fill='#FF5454'
    />
    <path
      d='M33.3333 6.6665H26.6667V3.33317C26.6667 2.89114 26.4911 2.46722 26.1785 2.15466C25.8659 1.8421 25.442 1.6665 25 1.6665H15C14.558 1.6665 14.134 1.8421 13.8215 2.15466C13.5089 2.46722 13.3333 2.89114 13.3333 3.33317V6.6665H6.66667C6.22464 6.6665 5.80072 6.8421 5.48816 7.15466C5.17559 7.46722 5 7.89114 5 8.33317C5 8.7752 5.17559 9.19912 5.48816 9.51168C5.80072 9.82424 6.22464 9.99984 6.66667 9.99984H33.3333C33.7754 9.99984 34.1993 9.82424 34.5118 9.51168C34.8244 9.19912 35 8.7752 35 8.33317C35 7.89114 34.8244 7.46722 34.5118 7.15466C34.1993 6.8421 33.7754 6.6665 33.3333 6.6665ZM16.6667 6.6665V4.99984H23.3333V6.6665H16.6667Z'
      fill='#FF5454'
    />
    <path
      d='M18.3333 28.3333V16.6667C18.3333 16.2246 18.1577 15.8007 17.8452 15.4882C17.5326 15.1756 17.1087 15 16.6667 15C16.2246 15 15.8007 15.1756 15.4882 15.4882C15.1756 15.8007 15 16.2246 15 16.6667V28.3333C15 28.7754 15.1756 29.1993 15.4882 29.5118C15.8007 29.8244 16.2246 30 16.6667 30C17.1087 30 17.5326 29.8244 17.8452 29.5118C18.1577 29.1993 18.3333 28.7754 18.3333 28.3333Z'
      fill='#FF5454'
    />
    <path
      d='M24.9993 28.3333V16.6667C24.9993 16.2246 24.8238 15.8007 24.5112 15.4882C24.1986 15.1756 23.7747 15 23.3327 15C22.8907 15 22.4667 15.1756 22.1542 15.4882C21.8416 15.8007 21.666 16.2246 21.666 16.6667V28.3333C21.666 28.7754 21.8416 29.1993 22.1542 29.5118C22.4667 29.8244 22.8907 30 23.3327 30C23.7747 30 24.1986 29.8244 24.5112 29.5118C24.8238 29.1993 24.9993 28.7754 24.9993 28.3333Z'
      fill='#FF5454'
    />
  </svg>
);

DeleteIcon.defaultProps = {
  height: undefined,
  width: undefined,
};

export default DeleteIcon;
