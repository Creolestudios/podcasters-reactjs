import React, { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Router from './routing/Router';
import { CLOUDINARY_URL, GOOGLE_APP_ID } from './clientConfig';

import './assets/scss/style.scss';
import { getCookie, setCookie } from './utils';

const App = () => {
  const imageBaseUrl = CLOUDINARY_URL;

  const imageProperties = {
    '--background-login-Image': 'RightSideLogin.svg',
    '--background-set-password': 'RightSidePassword.svg',
    '--background-Image': 'background.png',
    '--dorp-right-arrow': 'dorp-right-arrow.svg',
    '--search-icon': 'search-icon.svg',
    '--home-bottom': 'home-bottom.png',
    '--clone-icon': 'clone-icon.svg',
  };

  useEffect(() => {
    const root = document.documentElement;

    Object.entries(imageProperties).forEach(([property, image]) => {
      root.style.setProperty(property, `url(${imageBaseUrl}${image})`);
    });

    // code to generate a random id for episode view count analytics api for non-logged in users
    const userCookieId = getCookie('userCookieId');
    if (!userCookieId) {
      const newUserId = Math.floor(100000 + Math.random() * 900000);
      setCookie('userCookieId', newUserId, 365 * 24 * 60 * 60 * 1000);
    }
  }, []);

  return (
    <div>
      <GoogleOAuthProvider clientId={GOOGLE_APP_ID || ''}>
        <Router />
      </GoogleOAuthProvider>
    </div>
  );
};

export default App;
