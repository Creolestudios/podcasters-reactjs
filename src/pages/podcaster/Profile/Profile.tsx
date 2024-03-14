import React from 'react';
import Profile from '../../../components/Profile/Profile';
import { USER_ROLE } from '../../../constant';

const ProfilePage: React.FC = () => (
  <div className='podcaster-profile'>
    <Profile role={USER_ROLE.PODCASTER} />
  </div>
);

export default ProfilePage;
