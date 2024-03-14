import React from 'react';

const Loader: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={`d-flex align-items-center justify-content-center ${className}`}
  >
    <div className='loader'>
      <span className='bar' />
      <span className='bar' />
      <span className='bar' />
      <span className='bar' />
      <span className='bar' />
    </div>
  </div>
);

Loader.defaultProps = {
  className: '',
};

export default Loader;
