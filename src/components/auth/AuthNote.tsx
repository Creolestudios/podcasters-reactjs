import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import APP_ROUTES from '../../constant/appRoute';

const AuthNote: React.FC<{ path: string }> = ({ path }) => {
  const location = useLocation();
  const [isLoginScreen, setIsLoginScreen] = useState<boolean>(false);

  useEffect(() => {
    if (path.split('/').at(-1) === APP_ROUTES.LOGIN.slice(1)) {
      setIsLoginScreen(true);
    }
  }, []);

  return (
    <div className='position-relative top-20 d-flex justify-content-center mt-1 already-have'>
      {!isLoginScreen ? 'Do not have an account?' : 'Already have an account?'}

      {!isLoginScreen ? (
        <Link to={path} className='forgot cursor-pointer ms-1'>
          Register Now
        </Link>
      ) : (
        <Link to={path} className='forgot cursor-pointer ms-1'>
          Login Now
        </Link>
      )}
    </div>
  );
};

export default AuthNote;
