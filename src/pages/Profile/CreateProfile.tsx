import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { countries } from 'countries-list';
import { useNavigate } from 'react-router-dom';
import { updateProfileAction, updateUserDetails } from '../../services/user/User';
import { IUpdateUser } from '../../types';
import FormikWrapper from '../../components/FormikWrapper';
import FormikFieldWrapper from '../../components/FormikWrapper/FormikFieldWrapper';
import SvgIcons from '../../assets/svg/SvgIcons';
import { editProfileSchema } from '../../utils/formValidationSchema';
import RadioButton from '../../components/form/RadioButtonWrapper/RadioButton';
import RadioButtonWrapper from '../../components/form/RadioButtonWrapper';
import FormikTextAreaWrapper from '../../components/FormikWrapper/FormikTextAreaWrapper';
import { updateUserDetailAction } from '../../redux/actions/user';
import FormikSelectWrapper from '../../components/FormikWrapper/FormikSelectWrapper';
import { getLocalStorage, showToastMessage } from '../../utils';
import { TOASTER_STATUS } from '../../constant';
import Loader from '../../components/Loader/Loader';
import ProfileImageSelector from '../../components/ProfileImageSelector';

interface IProps {
  updateUserDetailAction: (data: IUpdateUser) => Promise<void>;
}

const CreateProfile: React.FC<IProps> = ({ updateUserDetailAction }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>('');
  const changeFile = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProfileUpdated, setIsProfileUpdated] = useState<boolean>(false);
  const userEmail = getLocalStorage('userEmail') || '';

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
        navigate('/podcaster/subscription-plan');
      })
      .catch(() => {
        showToastMessage(TOASTER_STATUS.ERROR, 'Something went wrong');
      });
  };

  const handleCreateProfile = async (value: IUpdateUser) => {
    const data = {
      dateOfBirth: value?.dateOfBirth,
      firstName: value?.firstName,
      lastName: value?.lastName,
      gender: value?.gender,
      bio: value?.bio,
      country: value?.country,
      email: value?.email,
    };
    setIsLoading(true);
    try {
      const res = await updateUserDetails(data);
      if (res) {
        updateUserDetailAction(data);
        showToastMessage(TOASTER_STATUS.SUCCESS, 'Profile created Successfully');
      } else {
        setIsLoading(false);
        showToastMessage(TOASTER_STATUS.ERROR, 'Something Went Wrong!');
      }
    } catch (error: any) {
      showToastMessage(TOASTER_STATUS.ERROR, error?.message || 'Something Went Wrong!');
      setIsLoading(false);
    }
    if (isProfileUpdated) doUpdateProfileAction(file, data);
    if (!isProfileUpdated) {
      navigate('/podcaster/subscription-plan');
    }
    setIsLoading(false);
  };

  const initialValues: IUpdateUser = {
    firstName: '',
    lastName: '',
    email: userEmail,
    dateOfBirth: '',
    gender: '',
    country: 'Select your Country',
    bio: '',
    profilePhotoUrl: '',
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-lg-12'>
          <div className='create-profile'>
            <div className='text-center mb-59'>
              <h1 className='mb-0'>Let’s create your profile</h1>
            </div>
            <div className='form-style edit-profile-w'>
              <FormikWrapper
                initialValues={initialValues}
                validationSchema={editProfileSchema}
                button={{
                  className: 'btn-style w-100 mt-1',
                  children: isLoading ? <Loader /> : 'Save',
                }}
                onSubmit={handleCreateProfile}
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
                      <div className='col'>
                        <FormikFieldWrapper
                          label='Email Address'
                          name='email'
                          type='email'
                          placeholder='Enter email address'
                          className='email-wrapper'
                          disabled={!!userEmail}
                        />
                      </div>
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
                                checked={false}
                                className={selectedValue === 'MALE' ? 'checked' : ''}
                              />
                            </div>
                            <div className='col-md-3'>
                              <RadioButton
                                id='female'
                                value='FEMALE'
                                label='Female'
                                name='gender'
                                checked={false}
                                className={selectedValue === 'FEMALE' ? 'checked' : ''}
                              />
                            </div>
                            <div className='col-md-6'>
                              <RadioButton
                                id='notspecify'
                                value='NOT_SPECIFIED'
                                label='Don’t want to specify'
                                name='gender'
                                checked={false}
                                className={selectedValue === 'NOT_SPECIFIED' ? 'checked' : ''}
                              />
                            </div>
                          </div>
                        </RadioButtonWrapper>
                      </div>
                    </div>
                    <div className='row'>
                      <FormikTextAreaWrapper
                        label='Tell me about yourself'
                        name='bio'
                        placeholder='Type here...'
                      />
                    </div>
                  </div>
                </div>
              </FormikWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  updateUserDetailAction,
};

export default connect(null, mapDispatchToProps)(CreateProfile);
