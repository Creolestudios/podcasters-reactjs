import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { countries } from 'countries-list';
import LeftArrow from '../../assets/svg/LeftArrow';
import { updateProfileAction, updateUserDetails } from '../../services/user/User';
import { getUser } from '../../redux/selectors/user';
import { IMonetizePodcast, IUpdateUser, IUser } from '../../types';
import { IState } from '../../redux/types';
import FormikWrapper from '../FormikWrapper';
import FormikFieldWrapper from '../FormikWrapper/FormikFieldWrapper';
import { editProfileSchema } from '../../utils/formValidationSchema';
import SvgIcons from '../../assets/svg/SvgIcons';
import FullPageLoader from '../Loader/FullPageLoader';
import ProfileImageSelector from '../ProfileImageSelector';
import { updateUserDetailAction } from '../../redux/actions/user';
import FormikTextAreaWrapper from '../FormikWrapper/FormikTextAreaWrapper';
import RadioButtonWrapper from '../form/RadioButtonWrapper';
import RadioButton from '../form/RadioButtonWrapper/RadioButton';
import './editprofile.scss';
import { S3_URL } from '../../clientConfig';
import Loader from '../Loader/Loader';
import { APP_HOST, TOASTER_STATUS } from '../../constant';
import { getHost, showToastMessage } from '../../utils';
import FormikSelectWrapper from '../FormikWrapper/FormikSelectWrapper';

interface IProps {
  user: IUser;
  updateUserDetailAction: (data: IUpdateUser | IMonetizePodcast) => Promise<void>;
}

const EditProfile: React.FC<IProps> = ({ user, updateUserDetailAction }) => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isProfileUpdated, setIsProfileUpdated] = useState<boolean>(false);
  const changeFile = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [selectedValue, setSelectedValue] = useState('');
  const countryCodes: string[] = Object.keys(countries);
  const allCountries = countryCodes.map((code) => countries[code as keyof typeof countries]?.name);

  const doUpdateProfileAction = async (file: File | null, data: IUpdateUser) => {
    await updateProfileAction(file)
      .then(async (resp) => {
        updateUserDetailAction({
          ...data,
          profilePhotoUrl: `${resp?.data?.result}`,
        });
        showToastMessage(TOASTER_STATUS.SUCCESS, 'Profile image updated successfully.');
        if (getHost() === APP_HOST.PODCASTER) {
          navigate('/podcaster/profile');
        } else if (getHost() === APP_HOST.ADMIN) {
          navigate('/admin/profile');
        } else {
          navigate('/profile');
        }
      })
      .catch(() => {
        showToastMessage(TOASTER_STATUS.ERROR, 'Something went wrong');
      });
  };

  const handleUpdateUser = async (values: IUpdateUser) => {
    setIsUpdating(true);
    const data = {
      firstName: values?.firstName,
      lastName: values?.lastName,
      dateOfBirth: values?.dateOfBirth,
      gender: values?.gender,
      country: values?.country,
      bio: values?.bio,
    };
    try {
      const response = await updateUserDetails(data);
      if (response?.data?.success) {
        updateUserDetailAction(data);
        showToastMessage(TOASTER_STATUS.SUCCESS, 'Profile updated successfully.');
      } else {
        showToastMessage(
          TOASTER_STATUS.ERROR,
          response?.data?.error?.txt || 'Something went wrong!',
        );
      }
    } catch (error: any) {
      showToastMessage(TOASTER_STATUS.ERROR, error?.message || 'Something went wrong!');
    }
    if (isProfileUpdated) doUpdateProfileAction(file, data);
    if (!isProfileUpdated) {
      navigate('/podcaster/profile');
      if (getHost() === APP_HOST.PODCASTER) {
        navigate('/podcaster/profile');
      } else if (getHost() === APP_HOST.ADMIN) {
        navigate('/admin/profile');
      } else {
        navigate('/profile');
      }
    }

    setIsUpdating(false);
  };

  const initialValues: IUpdateUser = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    dateOfBirth: user?.dateOfBirth?.toString().substring(0, 10) || '',
    gender: user?.gender || '',
    country: user?.country || 'Select your Country',
    bio: user?.bio || '',
    profilePhotoUrl: user?.profilePhotoUrl || '',
  };

  const handleImageFile = (e: any) => {
    setFile(e);
    setIsProfileUpdated(true);
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files && e?.target?.files?.length > 0) {
      setFile(e?.target?.files[0]);
      setIsProfileUpdated(true);
    }
  };

  return (
    <div className='container'>
      {!user?.firstName ? (
        <FullPageLoader isScreenExist />
      ) : (
        <>
          <div className='d-md-flex d-block align-items-center justify-content-between main-div'>
            <div className='main-title d-flex align-items-center'>
              {/* eslint-disable-next-line */}
              <span
                className='me-4 d-flex forward-btn'
                onClick={() => {
                  navigate(-1);
                }}
              >
                <LeftArrow />
              </span>
              Edit Profile
            </div>
          </div>
          <div className='form-style edit-profile-w'>
            <FormikWrapper
              initialValues={initialValues}
              validationSchema={editProfileSchema}
              button={{
                className: 'btn-style w-50',
                children: isUpdating ? <Loader /> : 'Save',
              }}
              onSubmit={handleUpdateUser}
            >
              <div className='row'>
                <div className='col-xl-3 col-lg-4'>
                  <ProfileImageSelector
                    name='profilePhotoUrl'
                    changeFile={changeFile}
                    handleImageFile={handleImageFile}
                    handleChangeImage={handleChangeImage}
                    file={file}
                    width={250}
                    height={250}
                  />
                </div>
                <div className='col-xl-9 col-lg-8'>
                  <div className='row'>
                    <div className='col'>
                      <FormikFieldWrapper
                        label='First Name'
                        name='firstName'
                        type='text'
                        placeholder='Enter First Name'
                      />
                    </div>
                    <div className='col'>
                      <FormikFieldWrapper
                        label='Last Name'
                        name='lastName'
                        type='text'
                        placeholder='Enter Last Name'
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <FormikFieldWrapper
                      label='Email Address'
                      name='email'
                      type='email'
                      placeholder='Enter email address'
                      className='email-wrapper'
                      disabled
                    />
                  </div>
                  <div className='row'>
                    <div className='col calendar-container'>
                      <FormikFieldWrapper
                        label='Date of Birth'
                        name='dateOfBirth'
                        type='date'
                        // className='col-md-6'
                        elementRender={(
                          <div className='calendar-icon'>
                            <SvgIcons iconType='date-picker-icon' />
                          </div>
                        )}
                      />
                    </div>
                    <div className='col'>
                      <FormikSelectWrapper
                        className='form-control form-select'
                        selectsuggestion='Select your Country'
                        name='country'
                        label='Country'
                        options={allCountries}
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-lg-12 gender-wrapper'>
                      <RadioButtonWrapper label='Gender' name='gender'>
                        <div className='row three-box'>
                          <div className='col-md-3'>
                            <RadioButton
                              id='male'
                              value='MALE'
                              label='Male'
                              name='gender'
                              checked={user?.gender === 'MALE'}
                              className={selectedValue === 'MALE' ? 'checked' : ''}
                            />
                          </div>
                          <div className='col-md-3'>
                            <RadioButton
                              id='female'
                              value='FEMALE'
                              label='Female'
                              name='gender'
                              checked={user?.gender === 'FEMALE'}
                              className={selectedValue === 'FEMALE' ? 'checked' : ''}
                            />
                          </div>
                          <div className='col-md-6'>
                            <RadioButton
                              id='notspecify'
                              value='NOT_SPECIFIED'
                              label='Don’t want to specify'
                              name='gender'
                              checked={user?.gender === 'NOT_SPECIFIED'}
                              className={selectedValue === 'NOT_SPECIFIED' ? 'checked' : ''}
                            />
                          </div>
                        </div>
                      </RadioButtonWrapper>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col user-bio'>
                      <FormikTextAreaWrapper label='Bio' name='bio' placeholder='Type here...' />
                    </div>
                  </div>
                </div>
              </div>
            </FormikWrapper>
          </div>
        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
