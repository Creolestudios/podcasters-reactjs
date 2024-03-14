import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from '../../../components/Login/Login';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import { ADMIN_APP_ROUTES } from '../../../constant/appRoute';
import { ILogin } from '../../../types/auth';
import { adminLoginAction } from '../../../redux/actions/user';

interface IProps {
  adminLoginAction: (
    loginData: ILogin,
    handleLoading: (value: boolean) => void,
    onContinue: () => void
  ) => void;
}

const LoginPage: React.FC<IProps> = ({ adminLoginAction }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const redirect = (path: string) => navigate(path);

  const onContinue = () => {
    redirect(`${ADMIN_APP_ROUTES.ROOT}/${ADMIN_APP_ROUTES.DASHBOARD}`);
  };
  const handleLoading = (value: boolean) => setIsLoading(value);
  const handleLogin = (values: ILogin) => {
    handleLoading(true);
    adminLoginAction(values, handleLoading, onContinue);
  };

  return (
    <div>
      {isLoading && <FullPageLoader isScreenExist />}
      <Login handleLogin={handleLogin} path={null} />
    </div>
  );
};
const mapDispatchToProps = {
  adminLoginAction,
};

export default connect(null, mapDispatchToProps)(LoginPage);
