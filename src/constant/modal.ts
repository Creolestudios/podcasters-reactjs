import PopupTickMark from '../assets/svg/PopupTickMark';
import SvgIcons from '../assets/svg/SvgIcons';

export const PAYMENT_SUCCESS = {
  BODY: {
    title: 'Payment Successful !',
    content: 'You’re all set and ready to start your podcast',
    icon: { Element: PopupTickMark },
  },
  BUTTON_CHILDREN: 'Start your Podcast',
};

export const PAYMENT_FAIL = {
  BODY: {
    title: 'Payment Failed !',
    content: 'Your payment was not successfully processed.',
    icon: { Element: SvgIcons, type: 'payment-failed' },
  },
  BUTTON1_CHILDREN: 'Contact with Us',
  BUTTON2_CHILDREN: 'Try Again',
};

export const UPGRADE_PLAN = {
  BODY: {
    title: 'Upgrade your Plan',
    content: 'You need to upgrade your plan for featured your podcasts.',
    icon: { Element: SvgIcons, type: 'upgrade-plan' },
  },
  BUTTON1_CHILDREN: 'View Subscription Plan',
};

export const OPEN_EDITOR = {
  BODY: {
    title: '',
    content:
      'Your work will be saved as a draft, and you will be redirected to the editor page.',
  },
  BUTTON1_CHILDREN: 'Cancel',
  BUTTON2_CHILDREN: 'Continue',
};
