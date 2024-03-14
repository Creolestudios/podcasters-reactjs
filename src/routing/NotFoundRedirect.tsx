import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/', { replace: true }); // Redirect to the desired page (e.g., homepage)
  }, [navigate]);

  return null; // Return null since this component doesn't render anything
};

export default NotFoundRedirect;
