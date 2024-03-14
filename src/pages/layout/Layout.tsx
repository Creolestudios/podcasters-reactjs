import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { getUserDetailAction } from '../../redux/actions/user';
import AdminLayout from './AdminLayout';
import UserLayout from './UserLayout';
import { APP_HOST } from '../../constant';
import FullPageLoader from '../../components/Loader/FullPageLoader';

interface IProps {
  getUserDetailAction: (host: string, handleLoading: CallableFunction) => void;
}

const Layout: React.FC<IProps> = ({ getUserDetailAction }) => {
  const host = localStorage.getItem('host');
  const token = localStorage.getItem('accessToken');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoading = (value: boolean) => setIsLoading(value);
  useEffect(() => {
    if (token && host) {
      handleLoading(true);
      getUserDetailAction(host, handleLoading);
    }
  }, []);

  if (token && host === APP_HOST.ADMIN) {
    return <AdminLayout />;
  }

  return isLoading ? <FullPageLoader /> : <UserLayout />;
};

const mapDispatchToProps = {
  getUserDetailAction,
};

export default connect(null, mapDispatchToProps)(Layout);
