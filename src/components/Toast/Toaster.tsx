import React from 'react';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Check from '../../assets/svg/Check';
import DeleteIcon from '../../assets/svg/DeleteIcon';
import Toast from './Toast';

export const toaster = (type: string, message: string) => {
  switch (type) {
    case 'SUCCESS': {
      return (
        <Toast
          icon={<Check />}
          colorCode='#e9dafb'
          message={message}
          type='success'
        />
      );
    }
    case 'ERROR': {
      return (
        <Toast
          icon={(
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              style={{ color: '#f6375d' }}
            />
          )}
          colorCode='#e9dafb'
          message={message}
          type='delete'
        />
      );
    }
    case 'DELETE': {
      return (
        <Toast
          icon={<DeleteIcon />}
          colorCode='#ffd9d9'
          message={message}
          type='delete'
        />
      );
    }
    case 'INFO': {
      return (
        <Toast
          icon={<Check />}
          colorCode='#e9dafb'
          message={message}
          type='success'
        />
      );
    }

    default:
      return (
        <Toast
          icon={<Check />}
          colorCode='#e9dafb'
          message={message}
          type='success'
        />
      );
  }
};
