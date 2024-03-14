import SvgIcons from '../assets/svg/SvgIcons';
import { ITransactionHistory } from '../types/podcaster';
import APP_ROUTES, { PODCASTER_APP_ROUTES as PODCASTER_ROUTES } from './appRoute';

export const podcastsColumns = [
  { key: 'name', value: 'Name' },
  { key: 'category', value: 'Category' },
  { key: 'type', value: 'Type' },
  { key: 'language', value: 'Language' },
  { key: 'views', value: 'Views' },
  { key: 'episodes', value: 'Episodes' },
  { key: 'ratings', value: 'Ratings' },
  { key: 'status', value: 'Status' },
];

export const podcastsActionMenuItems = [
  {
    label: 'view',
    IconName: SvgIcons,
    iconType: 'icon-view',
    url: PODCASTER_ROUTES.ROOT,
    hasIcon: true,
    isButton: false,
    slug: null,
  },
  {
    label: 'edit',
    IconName: SvgIcons,
    iconType: 'icon-edit',
    url: `${PODCASTER_ROUTES.ROOT}`,
    hasIcon: true,
    isButton: false,
    slug: `${PODCASTER_ROUTES.ROOT}/${PODCASTER_ROUTES.PODCAST_SLUG}/${APP_ROUTES.EDIT}`,
  },
  {
    label: 'delete',
    IconName: SvgIcons,
    iconType: 'icon-delete',
    url: '',
    hasIcon: true,
    isButton: true,
    slug: null,
  },
];

export const podasterTransactionColumns = [
  { key: 'name', value: 'Name' },
  { key: 'date', value: 'Date' },
  { key: 'time', value: 'Time' },
  { key: 'invoice id', value: 'Invoice ID' },
  { key: 'amount', value: 'Amount' },
  { key: 'status', value: 'Status' },
];

export const INITIAL_TRNASACTION_DATA: ITransactionHistory = {
  firstName: '',
  lastName: '',
  transactionDate: 0,
  invoiceId: '',
  amount: 0,
  transactionStatus: '',
};

export const adminListenerColumns = [
  { key: 'name', value: 'Name' },
  { key: 'email', value: 'Email' },
  { key: 'active plan', value: 'Active Plan' },
  { key: 'downloads', value: 'Downloads' },
];

export const adminPodcasterColumns = [
  { key: 'name', value: 'Name' },
  { key: 'email', value: 'Email' },
  { key: 'subscribers', value: 'Subscribers' },
  { key: 'views', value: 'Views' },
  { key: 'episodes', value: 'Episodes' },
  { key: 'ratings', value: 'Ratings' },
];

export const adminPodcasterActionMenuItems = [
  {
    label: 'edit plans',
    IconName: SvgIcons,
    iconType: 'icon-edit',
    url: '',
    hasIcon: true,
    isButton: true,
    slug: null,
  },
  {
    label: 'delete',
    IconName: SvgIcons,
    iconType: 'icon-delete',
    url: '',
    hasIcon: true,
    isButton: true,
    slug: null,
  },
  {
    label: 'block user',
    IconName: SvgIcons,
    iconType: 'admin_block_user',
    url: '',
    hasIcon: true,
    isButton: true,
    slug: null,
  },
];

export const adminPodcastActionMenuItems = [
  {
    label: 'block',
    IconName: SvgIcons,
    iconType: 'admin_block_user',
    url: '',
    hasIcon: true,
    isButton: true,
    slug: null,
  },
];

export const episodeActionMenuItems = [
  {
    label: 'edit',
    IconName: SvgIcons,
    iconType: 'icon-edit',
    url: '',
    hasIcon: true,
    isButton: true,
    slug: null,
  },
  {
    label: 'delete',
    IconName: SvgIcons,
    iconType: 'icon-delete',
    url: '',
    hasIcon: true,
    isButton: true,
    slug: null,
  },
];

export const episodeCommentActionMenuItems = [
  {
    label: 'report',
    IconName: SvgIcons,
    iconType: 'report-icon',
    url: '',
    hasIcon: true,
    isButton: true,
    slug: null,
  },
  {
    label: 'delete',
    IconName: SvgIcons,
    iconType: 'icon-delete',
    url: '',
    hasIcon: true,
    isButton: true,
    slug: null,
  },
];

export const adminPromoCodesColumns = [
  { value: 'Promo Code', key: 'Promo Code' },
  { value: 'Discount', key: 'Discount' },
  { value: 'Uses Limit', key: 'Uses Limit' },
  { value: 'Plan', key: 'Plan' },
  { value: 'Start Date & Time', key: 'Start Date & Time' },
  { value: 'End Date & Time', key: 'End Date & Time' },
];
