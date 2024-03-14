import React from 'react';
import AuthNote from './AuthNote';
import GoogleLoginContainer from './GoogleLoginContainer';
import FacebookLoginContainer from './FacebookLoginContainer';
import LinkedinLoginContainer from './LinkedinLoginContainer';

const SocialAuth: React.FC<{
  path: string;
  handleGoogleLogin: CallableFunction;
  handleFacebookLogin: CallableFunction;
  handleLinkedInLogin: CallableFunction;
}> = ({
  path,
  handleGoogleLogin,
  handleFacebookLogin,
  handleLinkedInLogin,
}) => (
  <div>
    <GoogleLoginContainer handleGoogleLogin={handleGoogleLogin} />
    <FacebookLoginContainer handleFacebookLogin={handleFacebookLogin} />
    <LinkedinLoginContainer handleLinkedInLogin={handleLinkedInLogin} />
    <AuthNote path={path} />
  </div>
);

export default SocialAuth;
