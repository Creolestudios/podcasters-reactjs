import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLocalStorageData } from '../utils';

const useCheckLoginStatus = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const { token, role } = getLocalStorageData();
    if (token && role === 'ADMIN') {
      navigate('/admin/home');
    } else if (token && role === 'PODCASTER') {
      navigate('/dashboard');
    }
  }, []);
};

export default useCheckLoginStatus;
