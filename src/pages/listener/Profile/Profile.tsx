import React from 'react';
import Profile from '../../../components/Profile/Profile';
import { USER_ROLE } from '../../../constant';

const ProfilePage: React.FC = () => (
  <div className='listener-profile'>
    <Profile role={USER_ROLE.LISTENER} />
  </div>
);

export default ProfilePage;
