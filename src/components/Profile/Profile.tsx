import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import EditEpisode from '../../assets/svg/EditEpisode';
import ProfileIcon from '../../assets/svg/ProfileIcon';
import { clearLocalStorage, isAdmin, showToastMessage } from '../../utils';
import { IMonetizePodcast, IUpdateUser, IUser } from '../../types';
import {
  addBankDetails,
  getBankDetails,
  podcastMonetize,
  updateBankDetails,
} from '../../services/user/User';
import { TOASTER_STATUS, USER_ROLE } from '../../constant';
import { IState } from '../../redux/types';
import { getUser } from '../../redux/selectors/user';
import './profile.scss';
import ButtonWrapper from '../form/ButtonWrapper';
import { updateUserDetailAction } from '../../redux/actions/user';
import ModalWrapper from '../form/ModalWrapper';
import FormikWrapper from '../FormikWrapper';
import FormikFieldWrapper from '../FormikWrapper/FormikFieldWrapper';
import { bankDetailsSchema } from '../../utils/formValidationSchema';
import Loader from '../Loader/Loader';
import { IBankDetails } from '../../types/podcaster';

interface IProps {
  user: IUser;
  role: string;
  updateUserDetailAction: (data: IUpdateUser | IMonetizePodcast) => Promise<void>;
}

const Profile: React.FC<IProps> = ({ user, role, updateUserDetailAction }) => {
  const navigate = useNavigate();
  const [isMonetized, setIsMonetized] = useState(user?.monetizedAllPodcasts);
  const [showBankDetails, setShowBankDetails] = useState<boolean>(false);
  const [isBankDetailSaved, setIsBankDetailSaved] = useState<boolean>(false);
  const [bankDetails, setBankDetails] = useState<IBankDetails | null>(null);
  const [bankDetailsPopupLoading, setBankDetailsPopupLoading] = useState<boolean>(false);

  const bankDetailsInitialValues: any = {
    accountNumber: bankDetails?.accountNumber || '',
    ifscCode: bankDetails?.ifscCode || '',
    bankName: bankDetails?.bankName || '',
    holderName: bankDetails?.holderName || '',
  };

  const handleBankDetails = (value: IBankDetails) => {
    setBankDetails(value);
  };
  const handleGetBankDetailsLoading = (value: boolean) => {
    setBankDetailsPopupLoading(value);
  };
  const handleBankDetailsPopup = (value: boolean) => {
    setShowBankDetails(value);
    handleGetBankDetailsLoading(true);
    if (value) {
      getBankDetails(handleBankDetails, handleGetBankDetailsLoading);
    }
  };

  const onSave = () => {
    handleBankDetailsPopup(false);
  };

  const handleBankDetailsButtonLoading = (value: boolean) => {
    setIsBankDetailSaved(value);
  };

  const handleSaveBankDetails = (values: IBankDetails) => {
    addBankDetails(values, onSave, handleBankDetailsButtonLoading);
  };

  const handleUpdateBankDetails = (value: IBankDetails) => {
    updateBankDetails(value, onSave, handleBankDetailsButtonLoading);
  };

  const handleMonetize = async (e: any) => {
    try {
      setIsMonetized(e?.target?.checked);
      const res = await podcastMonetize(e?.target?.checked);
      if (res?.data?.success) {
        showToastMessage(TOASTER_STATUS.SUCCESS, res?.data?.result);
        updateUserDetailAction({
          monetizedAllPodcasts: e?.target?.checked,
        });
      } else {
        showToastMessage(TOASTER_STATUS.ERROR, res?.data?.error?.txt);
      }
    } catch (error) {
      showToastMessage(TOASTER_STATUS.ERROR, 'Something went wrong');
    }
  };

  const handleClick = () => {
    if (role === USER_ROLE.ADMIN) {
      navigate('/admin/profile/edit');
    } else if (role === USER_ROLE.PODCASTER) {
      navigate('/podcaster/profile/edit');
    } else {
      navigate('/profile/edit');
    }
  };

  const handleLogout = () => {
    if (role === USER_ROLE.ADMIN) {
      navigate('/admin/login');
    } else if (role === USER_ROLE.PODCASTER) {
      navigate('/podcaster/login');
    } else {
      navigate('/login');
    }
  };

  const renderBankDetailPopupButton = () => {
    if (isBankDetailSaved) {
      return <Loader />;
    }
    if (bankDetails?.accountNumber) return 'Update';
    return 'Save';
  };

  return (
    <div className='container'>
      <div className='row main-div'>
        <div className='col-xl-8 col-lg-8 col-md-12'>
          <div className='profile-box'>
            {/* eslint-disable-next-line */}
            <div className='edit-icon ml-4' onClick={handleClick}>
              <EditEpisode />
            </div>
            <div className='d-md-flex d-block align-items-start'>
              <div className='mb-4 mb-md-0'>
                {user?.profilePhotoUrl ? (
                  <img
                    src={user?.profilePhotoUrl}
                    alt='user-icon'
                    className='img-fluid d-block rounded mx-auto user-profile'
                  />
                ) : (
                  <ProfileIcon height={190} width={190} />
                )}
              </div>
              <div className='profile-details ms-4'>
                <h1>{user?.firstName ? `${user?.firstName} ${user?.lastName}` : user?.email}</h1>
                <p>{user?.firstName && user?.email}</p>
                {role === USER_ROLE.PODCASTER && (
                  <div className='right-side-container '>
                    <div className='bank-details'>
                      <ButtonWrapper onClick={() => handleBankDetailsPopup(true)}>
                        Show Bank Details
                      </ButtonWrapper>
                    </div>
                    <div className='monetize-podcast'>
                      <div className='d-flex justify-content-start align-items-center'>
                        <input
                          type='checkbox'
                          id='monetize'
                          name='monetize'
                          checked={isMonetized}
                          onChange={handleMonetize}
                        />
                        {/* eslint-disable-next-line */}
                        <label htmlFor='monetize' className='checkbox'>
                          Monetize All Podcast
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='col-xl-4 col-lg-4 col-md-12'>
          {role === USER_ROLE.PODCASTER && (
            <div className='total-video mt-5 mt-lg-0'>
              <div className='d-flex align-items-center'>
                <h1 className='mb-0'>{user?.podcastCount}</h1>
                <p className='mb-0'>Total Podcast</p>
              </div>

              <div className='border-bottom-b' />

              <div className='d-flex align-items-center'>
                <h1 className='mb-0'>{user?.episodeCount}</h1>
                <p className='mb-0'>Total Episodes</p>
              </div>
            </div>
          )}
          {role === USER_ROLE.LISTENER && (
            <div className='total-video mt-5 mt-lg-0'>
              <div className='d-flex align-items-center'>
                <h1 className='mb-0'>{user?.downloadCount}</h1>
                <p className='mb-0'>Downloads</p>
              </div>

              <div className='border-bottom-b' />

              <div className='d-flex align-items-center'>
                <h1 className='mb-0'>{user?.favoriteCount}</h1>
                <p className='mb-0'>Favorites</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='row'>
        <div className='col-xl-12'>
          <div className='bio-details'>
            <h1>Bio</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: user?.bio?.replaceAll('\n', '<br />') || 'No description',
              }}
            />
          </div>
        </div>

        <div className='col-xl-12'>
          <div className='d-flex flex-wrap profile-btn '>
            <ButtonWrapper
              onClick={() => navigate('/password/update')}
              className='btn-primary reject-btn me-0 me-md-2'
            >
              Change Password
            </ButtonWrapper>
            <ButtonWrapper
              className='btn-primary btn-style ms-0 ms-md-2 btn-bg'
              onClick={() => {
                clearLocalStorage();
                showToastMessage(TOASTER_STATUS.SUCCESS, 'Logout Successfully.');
                handleLogout();
              }}
            >
              Logout
            </ButtonWrapper>
          </div>
        </div>
      </div>
      {showBankDetails && (
        <ModalWrapper
          size='lg'
          show={showBankDetails}
          handleClose={() => {
            handleBankDetailsPopup(false);
          }}
          className='bank-detail-popup'
          bodyClass=''
          body={{
            title: 'Bank Details',
            content: '',
          }}
          button1={{
            children: '',
            onClick: () => {},
          }}
          customElement={(
            <div className='form-container'>
              {bankDetailsPopupLoading ? (
                <Loader />
              ) : (
                <FormikWrapper
                  initialValues={bankDetailsInitialValues}
                  validationSchema={bankDetailsSchema}
                  button={{
                    className: 'btn-style w-50 m-auto',
                    children: renderBankDetailPopupButton(),
                    isDisabled: isBankDetailSaved,
                  }}
                  onSubmit={(value: any) => {
                    handleBankDetailsButtonLoading(true);
                    if (bankDetails?.accountNumber) handleUpdateBankDetails(value);
                    else handleSaveBankDetails(value);
                  }}
                >
                  <FormikFieldWrapper
                    label='Bank Account No.'
                    name='accountNumber'
                    type='number'
                    placeholder='Enter Bank Account No.'
                  />
                  <FormikFieldWrapper
                    label='IFSC Code'
                    name='ifscCode'
                    type='text'
                    placeholder='Enter IFSC Code'
                  />
                  <FormikFieldWrapper
                    label='Bank Name'
                    name='bankName'
                    type='text'
                    placeholder='Enter Bank Name'
                  />
                  <FormikFieldWrapper
                    label='Account Holder Name'
                    name='holderName'
                    type='text'
                    placeholder='Enter Account Holder Name'
                  />
                </FormikWrapper>
              )}
            </div>
          )}
          isButton={false}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  user: getUser(state),
});

const mapDispatchToProps = {
  updateUserDetailAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
