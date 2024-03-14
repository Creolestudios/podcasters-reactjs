import * as Yup from 'yup';
import {
  convertBytesIntoMB,
  validateSlugSpecialCharacter,
  getAudioDuration,
  getMinutesFromSeconds,
} from '.';

export const getRequiredText = (field: string) => `${field} is required`;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const htmlTagRegex = /<\/?[a-z][\s\S]*>/i;

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required(getRequiredText('Email'))
    .max(50, 'Maximum 50 characters allowed')
    .matches(emailRegex, 'Email address must be a valid email'),
  password: Yup.string()
    .required(getRequiredText('Password'))
    .min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = Yup.object().shape({
  email: Yup.string()
    .required(getRequiredText('Email'))
    .max(50, 'Maximum 50 characters allowed')
    .matches(emailRegex, 'Email address must be a valid email'),
  password: Yup.string()
    .required(getRequiredText('Password'))
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character',
    )
    .matches(/^[^\s]+$/, 'Space are not allowed in the password'),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref('password'), ''],
      'Confirm password must be same as password',
    )
    .required(getRequiredText('Confirm Password'))
    .min(8, 'Password must be at least 8 characters'),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required(getRequiredText('Email'))
    .max(50, 'Maximum 50 characters allowed')
    .matches(emailRegex, 'Email address must be a valid email'),
});

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required(getRequiredText('Password'))
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character',
    )
    .matches(/^[^\s]+$/, 'Space are not allowed in the password'),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref('password'), ''],
      'Confirm password must be same as password',
    )
    .required(getRequiredText('Confirm Password'))
    .min(8, 'Password must be at least 8 characters'),
});

export const checkoutFormSchema = Yup.object().shape({
  name: Yup.string().required(getRequiredText('Full Name')),
});

export const editProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .max(50, 'Maximum 50 characters allowed')
    .required('First name is required'),
  lastName: Yup.string()
    .trim()
    .max(50, 'Maximum 50 characters allowed')
    .required('Last name is required'),
  email: Yup.string()
    .required(getRequiredText('Email'))
    .max(50, 'Maximum 50 characters allowed')
    .matches(emailRegex, 'Email address must be a valid email'),
  country: Yup.string().notOneOf(
    ['Select your Country'],
    'Please select your country',
  ),
  dateOfBirth: Yup.string()
    .max(10, 'Please select right year')
    .required('Date of birth is required')
    .test(
      'is-valid-date',
      'Invalid date. Please select a valid date.',
      (value) => {
        // Check if the date is a valid date and not in the future
        const parsedDate = new Date(value);
        const currentDate = new Date();

        return !Number.isNaN(parsedDate.getTime()) && parsedDate <= currentDate;
      },
    ),
  gender: Yup.string().required('Please select a gender'),
  bio: Yup.string().test(
    'html-tags',
    'For security reasons, HTML tags are not allowed',
    (value) => !htmlTagRegex.test(value || ''), // Return true if the value does NOT contain HTML tags
  ),
});

export const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Please enter your old password'),
  newPassword: Yup.string()
    .required('Please enter your new password')
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character',
    )
    .matches(/^[^\s]+$/, 'Space are not allowed in the password')
    .notOneOf(
      [Yup.ref('oldPassword'), ''],
      'New Passwords and  Old Password cannot be same',
    ),
  confirmPassword: Yup.string()
    .required('Confirm password must')
    .oneOf([Yup.ref('newPassword'), ''], 'Passwords must match'),
});

export const episodeSchema = Yup.object().shape({
  thumbnail: Yup.string().required(getRequiredText('Thumbnail')),
  cover: Yup.string().required(getRequiredText('Cover')),
  episodeNo: Yup.string()
    .required(getRequiredText('Episode No'))
    .test(
      'valid-positive-number',
      'Please enter a valid positive integer for the episode number',
      (value) => Number(value) > 0,
    ),
  episodeTitle: Yup.string()
    .required(getRequiredText('Episode title'))
    .min(4, 'Please enter a title between 4 to 255 characters')
    .max(255, 'Please enter a title between 4 to 255 characters'),
  description: Yup.string()
    .required(getRequiredText('Description'))
    .min(10, 'Description should be 10 to 500 characters')
    .max(500, 'Description should be 10 to 500 characters'),
  episodeCountry: Yup.string().required(
    'Please select a valid country for the episode',
  ),
});

export const podcastSchema = Yup.object().shape({
  thumbnail: Yup.string().required(getRequiredText('Thumbnail')),
  cover: Yup.string().required(getRequiredText('Cover')),
  podcastTitle: Yup.string()
    .required(getRequiredText('Podcast Title'))
    .min(4, 'Please enter a title between 4 to 255 characters')
    .max(255, 'Please enter a title between 4 to 255 characters'),
  slugUrl: Yup.string()
    .required('Slug URL is required. Please provide a valid slug')
    .min(4, 'The slug should be between 4 to 50 characters')
    .max(50, 'The slug should be between 4 to 50 characters')
    .test(
      'specialCharacter',
      'Please use only lowercase letters, numbers, and hyphens',
      (value) => validateSlugSpecialCharacter(value),
    ),
  podcastCategory: Yup.string().required(
    'Please select a valid podcast category',
  ),
  podcastType: Yup.string().required('Please select a valid podcast type'),
  country: Yup.string().required('Please select a valid country'),
  language: Yup.string().required('Please select a valid podcast language'),
  description: Yup.string()
    .required(getRequiredText('Description'))
    .min(10, 'Description should be 10 to 500 characters')
    .max(500, 'Description should be 10 to 500 characters'),
});

export const featuredPodcastSchema = Yup.object().shape({
  startDate: Yup.string().required(getRequiredText('Start Date')),
  endDate: Yup.string().required(getRequiredText('End Date')),
});

export const bankDetailsSchema = Yup.object().shape({
  accountNumber: Yup.string()
    .required(getRequiredText('Account number'))
    .matches(/^\d+$/, 'Only numbers are allowed')
    .min(12, 'Account number must be at least 12 characters')
    .max(16, 'Please enter a Account number between 12 to 16 characters'),
  ifscCode: Yup.string()
    .required(getRequiredText('IFSC code'))
    .test('no-spaces', 'Spaces are not allowed', (value) => !/\s/.test(value))
    .min(10, 'Password must be at least 10 characters')
    .max(16, 'Please enter a IFSC code between 12 to 16 characters'),
  bankName: Yup.string()
    .required(getRequiredText('Bank name'))
    .matches(/^[^\d]+$/, 'Bank name should not contain numbers')
    .test(
      'no-leading-trailing-spaces',
      'Leading and trailing spaces are not allowed',
      (value) => !/^\s|\s$/.test(value),
    )
    .max(50, 'Maximum 50 characters allowed'),
  holderName: Yup.string()
    .required(getRequiredText('Account holder name'))
    .matches(/^[^\d]+$/, 'Account holder name should not contain numbers')
    .test(
      'no-leading-trailing-spaces',
      'Leading and trailing spaces are not allowed',
      (value) => !/^\s|\s$/.test(value),
    )
    .max(50, 'Maximum 50 characters allowed'),
});

export const validateAudioWithDuration = async (
  track: File,
  maxSize: number,
  maxDuration: number | undefined,
) => {
  const trackSize = convertBytesIntoMB(track.size);
  const duration: number = await new Promise((resolve) => {
    getAudioDuration(track, (duration: number) => {
      resolve(duration);
    });
  });

  if (duration && maxDuration) {
    if (duration > maxDuration) {
      return `Audio duration should not be more than ${getMinutesFromSeconds(maxDuration)
        .replace('min', 'Minutes')
        .replace('sec', 'Seconds')}`;
    }
    if (trackSize > maxSize) {
      return maxSize
        ? `File size should not be more than ${maxSize} MB`
        : 'File size too large';
    }
    return null;
  }
  return '';
};

export const validateAudio = (track: File, maxSize: number) => {
  const trackSize = convertBytesIntoMB(track.size);

  if (trackSize > maxSize) {
    return maxSize
      ? `File size should not be more than ${maxSize} MB`
      : 'File size too large';
  }
  return null;
};

export const blockReasonSchema = Yup.object().shape({
  reason: Yup.string().required(getRequiredText('Reason')),
});

export const addUserSchema = Yup.object().shape({
  email: Yup.string()
    .required(getRequiredText('Email'))
    .max(50, 'Maximum 50 characters allowed')
    .matches(emailRegex, 'Email address must be a valid email'),
});

export const addPromoCodeSchema = Yup.object().shape({
  couponName: Yup.string().required(getRequiredText('Promo code name'))
    .max(50, 'Maximum 50 characters allowed'),
  coupounUsageType: Yup.string().required(getRequiredText('Uses')),
  maxRedemptions: Yup.number().test('coupounUsageType', 'Uses limit is required', (value, context) => {
    const { coupounUsageType } = context.parent;
    if (coupounUsageType === 'Limited') {
      return typeof (value) === 'number';
    }
    return true;
  }).min(1, 'Uses limit must be grater then 0'),
  couponOffType: Yup.string(),
  discount: Yup.number().test('couponOffType', 'Discount is required', (value, context) => {
    const { couponOffType } = context.parent;
    if (couponOffType === 'PERCENTAGE') {
      return typeof (value) === 'number';
    }
    return true;
  }).min(1, 'Discount must be grater then 0')
    .max(100, 'Discount can not be grater than 100'),
  amount: Yup.number().nullable().test('couponOffType', 'Amount is required', (value, context) => {
    const { couponOffType } = context.parent;
    if (couponOffType === 'FLAT') {
      return typeof (value) === 'number';
    }
    return true;
  }).min(1, 'Amount must be grater then 0'),
  startDate: Yup.string().required(getRequiredText('Start date')),
  startTime: Yup.string().required(getRequiredText('Start time')),
  endDate: Yup.string().required(getRequiredText('End date')).test('is-greater', 'End date must be after start date', function (endDate) {
    const { startDate } = this.parent;
    return new Date(endDate) >= new Date(startDate);
  }),
  endTime: Yup.string().required(getRequiredText('End time')).test('is-greater', 'End time must be after start time', function (endTime) {
    const { startDate, endDate, startTime } = this.parent;
    const startDateTime = new Date(`${startDate} ${startTime}`);
    const endDateTime = new Date(`${endDate} ${endTime}`);
    return endDateTime > startDateTime;
  }),
  applicableTo: Yup.string(),
  planIds: Yup.array().test('applicableTo', 'Plan or user is required', (value, context) => {
    const { applicableTo, userIds } = context.parent;
    if (userIds && value && userIds.length === 0 && value.length === 0) {
      return false;
    }
    if (applicableTo === 'PLAN') {
      return value && value?.length > 0;
    }
    return true;
  }),
  userIds: Yup.array().test('applicableTo', 'Pla or user is required', (value, context) => {
    const { applicableTo, planIds } = context.parent;
    if (planIds && value && planIds.length === 0 && value.length === 0) {
      return false;
    }
    if (applicableTo === 'USER') {
      return value && value?.length > 0;
    }
    return true;
  }),
});
