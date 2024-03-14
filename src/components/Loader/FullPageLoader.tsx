import React from 'react';

import Loader from './Loader';

const FullPageLoader: React.FC<{ isScreenExist?: boolean }> = ({
  isScreenExist,
}) => (
  <div
    className={`vh-100 d-flex align-items-center justify-content-center ${
      isScreenExist ? 'screen-loader' : ''
    }`}
  >
    <Loader />
  </div>
);

FullPageLoader.defaultProps = {
  isScreenExist: false,
};

export default FullPageLoader;
