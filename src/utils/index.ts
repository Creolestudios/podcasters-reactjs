import moment from 'moment';
import toast from 'react-hot-toast';
import { countries, languages } from 'countries-list';

import { toaster } from '../components/Toast/Toaster';
import { IUser } from '../types';
import { PODCAST_STATUS, TOASTER_STATUS } from '../constant';
import { Category } from '../types/podcastInterface';

export const setDataInLocalStorage = (data: any) => {
  if (data.accessToken) {
    localStorage.setItem('accessToken', data?.accessToken);
    localStorage.setItem('roles', JSON.stringify(data?.roles));
    localStorage.setItem('userUuid', data?.uuid);
    localStorage.setItem('tokenExpiryTime', data?.expiryTime);
    localStorage.setItem('userEmail', data?.email);
  }
};

export const getLocalStorageData = () => {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('roles');

  return { token, role };
};

export const clearLocalStorage = async () => {
  localStorage.clear();
};

export const handleCheckLoginStatusAtLoginPage = (navigate: Function) => {
  const { token, role } = getLocalStorageData();
  if (token && role === 'ADMIN') {
    navigate('/admin/home');
  } else if (token && role === 'PODCASTER') {
    navigate('/dashboard');
  }
};

export const getCurrentUserInfo = () => JSON.parse(localStorage.getItem('user') ?? '');

export const setCurrentUser = (data: any) => {
  localStorage.setItem('user', JSON.stringify(data));
};

export const isAdmin = () => localStorage.getItem('role') === 'ADMIN';

export const getAudioDuration = (data: any, returnFunction: Function) => {
  if (!data) {
    return;
  }

  const audioElement = new Audio();
  if (typeof data === 'object') {
    audioElement.src = URL.createObjectURL(data);
  } else if (typeof data === 'string') {
    audioElement.src = data;
  }

  // Define a named function as the event listener
  function loadedMetadataHandler() {
    const seconds = moment
      .duration(audioElement.duration, 'seconds')
      .asSeconds();
    returnFunction(seconds);

    // Remove the event listener
    audioElement.removeEventListener('loadedmetadata', loadedMetadataHandler);
  }

  // Add the event listener
  audioElement.addEventListener('loadedmetadata', loadedMetadataHandler);

  audioElement.load();
};

export const getImageFileResolution = (
  file: Blob,
  // eslint-disable-next-line no-use-before-define
  returnFunction: (resolution: string) => void,
) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    if (reader.readyState === FileReader.DONE) {
      const img = new Image();
      img.onload = () => {
        const { naturalWidth, naturalHeight } = img;
        returnFunction(`${naturalWidth}x${naturalHeight}`);
      };

      // Check if e.target.result is a string before assigning it to img.src
      if (e.target && typeof e.target.result === 'string') {
        img.src = e.target.result;
      } else {
        // console.error("Failed to read image data as a string.");
      }
    }
  };

  reader?.readAsDataURL(file);
};

export const displayName = (firstName: string, lastName: string) => {
  const name = [firstName, lastName];
  return firstName || lastName ? name.join(' ') : '-';
};

export const allowedPaths = [
  '/login',
  '/validateInvite',
  '/forgotPassword',
  '/resetPassword',
  '/podcasts/getPodcastsWithEpisodes',
  '/api/guest',
  'https://dev-musajjel-data.s3.amazonaws.com/',
  'https://prod-musajjel-data.s3.amazonaws.com',
];

export const getInTitleCase = (value: string) => (value?.length > 0
  ? `${value[0].toUpperCase()}${value.slice(1).toLowerCase()}`
  : value);

export const formatText = (text: string) => {
  if (text?.length > 0) {
    const textList = text.split(' ');
    if (textList.length <= 3) {
      return textList.map((item: string) => getInTitleCase(item)).join(' ');
    }
    return getInTitleCase(text);
  }
  return getInTitleCase(text);
};

export const showToastMessage = (status: any, message: any) => toast(
    toaster(
      status,
      formatText(message) ?? 'Something Went Wrong!',
    ) as React.ReactElement,
);

export function invokeWithDelay(callback: Function, delayTime: number) {
  return setTimeout(callback, delayTime);
}

export const getHost = () => localStorage.getItem('host');

export const getUserTitle = (user: IUser) => {
  if (
    user.firstName
    && user.lastName
    && user.firstName !== ''
    && user.lastName !== ''
  ) {
    return `${getInTitleCase(user.firstName)} ${getInTitleCase(user.lastName)}`;
  }
  if (user.firstName && user.firstName !== '') {
    return getInTitleCase(user.firstName);
  }

  return getInTitleCase(user.email);
};

export const getTitle = (name: string) => {
  if (name?.length > 0) {
    const nameList = name.split(' ');

    return nameList.map((item: string) => getInTitleCase(item)).join(' ');
  }
  return getInTitleCase(name);
};
// Format the time in MM:SS format
export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

export function formatDayAndMonth(seconds: number) {
  const getOrdinalSuffix = (number: number) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = number % 100;
    return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  const date = new Date(seconds * 1000);

  const dayOfMonth = date.getDate();
  const ordinalDay = getOrdinalSuffix(dayOfMonth);

  const month = date.toLocaleDateString('en-US', { month: 'short' });

  const formattedDate = `${ordinalDay} ${month}`;

  return formattedDate;
}

export const formatTimeLeft = (seconds: number) => {
  const minute = 60;
  const hour = 60 * minute;

  if (seconds < minute) {
    return `${seconds} ${seconds === 1 ? 'sec' : 'secs'} left`;
  }
  if (seconds < hour) {
    const minutes = Math.floor(seconds / minute);
    return `${minutes} ${minutes === 1 ? 'min' : 'mins'} left`;
  }
  const hours = Math.floor(seconds / hour);
  const remainingMinutes = Math.floor((seconds % hour) / minute);
  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} ${
    remainingMinutes === 1 ? 'min' : 'mins'
  } left`;
};

export function formatTimeRemaining(
  totalDuration: number,
  elapsedDuration: number,
) {
  const remainingDuration = totalDuration - elapsedDuration;

  const hours = Math.floor(remainingDuration / 3600);
  const minutes = Math.floor((remainingDuration % 3600) / 60);
  const seconds = remainingDuration % 60;

  if (hours > 0) {
    return `${hours} hour ${minutes} min ${seconds} sec left`;
  }
  if (minutes > 0) {
    return `${minutes} min ${seconds} sec left`;
  }
  return `${seconds} sec left`;
}

export const getValueLocalStorage = (key: string) => localStorage.getItem(key) ?? '';

export const getDate = (value: string, type: string) => {
  switch (type) {
    case 'MM DD':
      return moment(value).format('MMM DD');
    case 'ISO':
      return moment(value, 'YYYY-MM-DD HH:mm').toISOString();
    case 'UNIX':
      return moment(value, 'YYYY-MM-DD HH:mm:ss').unix();
    case 'DD/MM/YYYY':
      return moment.unix(Number(value)).format('DD/MM/YYYY');
    case 'MMM D':
      return moment.unix(Number(value)).format('MMM D');
    default:
      return moment.unix(Number(value)).format(type);
  }
};

export const getTimeFromDate = (value: string, type?: string) => {
  switch (type) {
    case 'h:mm A':
      return moment.unix(Number(value)).format('h:mm A');
    default:
      return new Date(value).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
  }
};

export const getMinutesFromSeconds = (totalSeconds: number, type?: string) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (type === 'mm:ss') {
    return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(
      2,
      '0',
    )}`;
  }
  if (seconds === 0) {
    return `${minutes} min`;
  }
  return `${minutes} min ${seconds} sec`;
};

export const getCountries = () => {
  const countryCodes = Object.keys(countries);

  return countryCodes.map((code: string) => (countries[code as keyof typeof countries]?.name === 'Israel'
    ? 'West Bank'
    : countries[code as keyof typeof countries]?.name));
};

export const getLangauges = () => {
  const langaugeCode = Object.keys(languages);
  return langaugeCode.map(
    (code: string) => languages[code as keyof typeof languages]?.name,
  );
};

export const getScheduledDateTime = (date: string, time: string) => {
  if (date && time && date?.length > 0 && time?.length > 0) {
    return getDate(`${date} ${time}:00`, 'UNIX');
  }
  return 0;
};

export const getFileExtension = (file: File | string) => {
  if (typeof file === 'string') {
    return `.${file?.split('.')?.at(-1)}`;
  }
  return `.${file?.name?.split('.')?.at(-1)}`;
};

export function convertDateTimeFromUnix(value: number, type: string) {
  return moment.unix(value).format(type);
}

export const getDateOrTimeFromStatus = (
  value: number,
  type: string,
  status: string,
) => {
  if (status.toLowerCase() === PODCAST_STATUS.SCHEDULE) {
    return convertDateTimeFromUnix(value, type);
  }
  return '';
};

export const getUserTimeZone = () => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  return timeZone;
};

export const formatDate = (timestampInSeconds: number) => {
  const formattedDate = moment.unix(timestampInSeconds).format('DD MMM YYYY');
  return formattedDate;
};

export const getTimeFromSeconds = (seconds: number) => {
  const timestampInSeconds = seconds;
  const formattedTime = moment.unix(timestampInSeconds).format('h:mm A');
  return formattedTime;
};

export const getUuidFromOptionName = (options: Category[], value: string) => options.find(
  (option: Category) => option.name.toLowerCase() === value.toLowerCase(),
)?.uuid ?? '';

export const getCountWithSuffix = (value: number, suffix: string) => {
  switch (suffix) {
    case 'K':
      return value < 1000 ? `${value}` : `${value / 1000} K`;
    default:
      return `${value}`;
  }
};

const isJSON = (text: any) => {
  if (typeof text !== 'string') {
    return false;
  }

  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
};

export function getLocalStorage(key: string) {
  if (localStorage && typeof localStorage !== 'undefined') {
    const item = localStorage?.getItem(key);
    if (item) {
      if (isJSON(item)) return JSON.parse(item);
      return item;
    }
    return null;
  }
  // eslint-disable-next-line
  top?.postMessage(JSON.stringify({ message: 'getLocalStorage', key }), '*');
  return new Promise((resolve) => {
    window.addEventListener(
      'message',
      (event) => {
        resolve(JSON.parse(event.data));
      },
      false,
    );
  }).then((resp) => resp);
}

export function setLocalStorage(key: string, value: any) {
  if (typeof localStorage !== 'undefined') {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  // eslint-disable-next-line
  return top?.postMessage(
    JSON.stringify({ message: 'setLocalStorage', key, value }),
    '*',
  );
}

export const getTimeInSeconds = (daysAgo: number) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - daysAgo);
  return Math.floor(currentDate.getTime() / 1000);
};

export const updateDates = (selectedRange: string) => {
  const today = new Date();
  const todayInSeconds = getTimeInSeconds(0);
  switch (selectedRange) {
    case 'Weekly': {
      const startOfLastWeek = new Date(todayInSeconds * 1000);
      startOfLastWeek.setDate(
        startOfLastWeek.getDate() - startOfLastWeek.getDay(),
      );
      const endOfLastWeek = new Date(todayInSeconds * 1000);
      endOfLastWeek.setDate(
        endOfLastWeek.getDate() + (6 - endOfLastWeek.getDay()),
      );
      return {
        startDate: Math.floor(startOfLastWeek.getTime() / 1000),
        endDate: Math.floor(endOfLastWeek.getTime() / 1000),
      };
    }

    case 'Monthly': {
      const startOfLast30Days = getTimeInSeconds(30);
      return {
        startDate: startOfLast30Days,
        endDate: todayInSeconds,
      };
    }

    case 'Last 60 Days': {
      const startOfLast60Days = getTimeInSeconds(60);
      return {
        startDate: startOfLast60Days,
        endDate: todayInSeconds,
      };
    }

    default:
      return {
        startDate: 0,
        endDate: 0,
      };
  }
};

export function getNumbersListFromRange(start: number, end: number) {
  return Array.from(
    { length: end - start + 1 },
    (_, index: number) => start + index,
  );
}

export function getASCIICode(value: string) {
  return value.split('').map((character: string) => character.charCodeAt(0));
}

export function validateTitleSpecialCharacter(value: string) {
  const codes = [
    ...getNumbersListFromRange(33, 47),
    ...getNumbersListFromRange(58, 64),
    ...getNumbersListFromRange(91, 96),
    ...getNumbersListFromRange(124, 126),
  ];

  return !getASCIICode(value).some((code) => codes.includes(code));
}

export function validateSlugSpecialCharacter(value: string) {
  const codes = [
    ...getNumbersListFromRange(32, 44),
    ...getNumbersListFromRange(46, 47),
    ...getNumbersListFromRange(58, 90),
    ...getNumbersListFromRange(91, 96),
    ...getNumbersListFromRange(124, 126),
  ];

  return !getASCIICode(value).some((code) => codes.includes(code));
}

export function validateHtmlTag(value: string) {
  const htmlTagRegex = /<\/?[a-z][\s\S]*>/i;
  if (htmlTagRegex.test(value)) {
    return true;
  }
  return false;
}

export function getSplicedItems(
  items: any[],
  index: number,
  howMany: number,
  item: any,
) {
  if (item) {
    items.splice(index, howMany, item);
  } else {
    items.splice(index, howMany);
  }

  return items;
}

export const autoGenerateAudioName = (name: any, data: any) => {
  const sameAudioNames = data.filter(
    (element: any) => name === element.name.split('-')[0],
  );

  return `${name}-${sameAudioNames.length}`;
};

export function camelCaseToTitleCase(str: string) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}

export function convertBytesIntoMB(bytes: number) {
  return bytes / (1024 * 1024);
}

export function convertBytesIntoKB(bytes: number) {
  return bytes / 1024;
}

export function setCookie(name: string, value: any, expirationTime: number) {
  const d = new Date();
  d.setTime(d.getTime() + expirationTime);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

export function getCookie(name: string) {
  const cookieName = `${name}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let i = 0; i < cookieArray.length; i += 1) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }

  return null;
}

export const downloadFileFromUrl = (
  type: string,
  url: string,
  name: string,
) => {
  // Create anchor element
  const element = document.createElement('a');

  element.href = url;
  element.download = `${name}.${type}`;

  document.body.appendChild(element);
  element.click();

  // Remove created anchor element
  document.body.removeChild(element);
};

export function convertLinearToDecibel(linerValue: number) {
  if (linerValue <= 0) {
    return 0;
  }
  return 20 * Math.log10(linerValue);
}
export const downloadAudioFile = (
  fileFormat: string,
  audioUrl: string,
  name: string,
) => {
  showToastMessage(TOASTER_STATUS.SUCCESS, 'Episode Downloading...');
  // Make a fetch request to get the file content
  fetch(audioUrl)
    .then((response) => response.blob())
    .then((blob) => {
      // Create a Blob from the fetched content
      const url = URL.createObjectURL(blob);
      // Create a link element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}_${new Date().toISOString()}.${fileFormat}`;
      a.innerHTML = a.download;
      // Append the link to the document, trigger the click, and remove the link
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Revoke the object URL to free up resources
      URL.revokeObjectURL(url);
    })
    .catch((error) => showToastMessage(
      TOASTER_STATUS.ERROR,
      `'Error downloading audio:'  ${error || 'Something went wrong!'}`,
    ));
};

export function getTimeDifference(seconds: number) {
  const currentDate: Date = new Date();
  const createdAtDate: Date = new Date(seconds * 1000); // Convert seconds to milliseconds

  // Check if the createdAtDate indicate present day's date
  if (createdAtDate.toDateString() === currentDate.toDateString()) {
    const hours: number = createdAtDate.getHours();
    const minutes: number = createdAtDate.getMinutes();
    const ampm: string = hours >= 12 ? 'PM' : 'AM';
    const formattedTime: string = `${(hours % 12)
      .toString()
      .padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    return formattedTime;
  }

  const timeDifferenceMs: number = currentDate.getTime() - createdAtDate.getTime();
  const daysPassed: number = timeDifferenceMs / (1000 * 60 * 60 * 24);
  const monthsPassed: number = timeDifferenceMs / (1000 * 60 * 60 * 24 * 30);
  const yearsPassed: number = timeDifferenceMs / (1000 * 60 * 60 * 24 * 365);

  if (yearsPassed > 1) {
    return `${Math.floor(yearsPassed)} ${
      Math.floor(yearsPassed) === 1 ? 'year' : 'years'
    } ago`;
  }
  if (monthsPassed > 1) {
    return `${Math.floor(monthsPassed)} ${
      Math.floor(monthsPassed) === 1 ? 'month' : 'months'
    } ago`;
  }
  if (daysPassed > 1) {
    return `${Math.floor(daysPassed)} ${
      Math.floor(daysPassed) === 1 ? 'day' : 'days'
    } ago`;
  }
  return null;
}

export function truncateContentWithEllipsis(
  content: string,
  maxLength: number,
) {
  if (content.length <= maxLength) {
    return content;
  }
  return `${content.slice(0, maxLength + 1)}..`;
}
