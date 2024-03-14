import React from 'react';
import { ToastInterface } from '../../types/toastInterface';

const Toast = (props: ToastInterface) => {
  const { icon, message, type } = props;
  return (
    <div className='toast-main'>
      <div
        className={`toast_msg ${
          type === 'delete' ? 'delete_toast' : 'success_toast'
        }`}
      >
        <div className='d-flex align-items-center '>
          <span className='mx-2'>{icon}</span>
          {message}
        </div>
      </div>
    </div>
  );
};

export default Toast;
