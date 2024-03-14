import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SvgIcons from '../../../assets/svg/SvgIcons';
import { CLOUDINARY_URL } from '../../../clientConfig';
import {
  getAuthorSubscirbeAndRatingDetails,
  rateAuthor,
  subscribeUnscribeAuthor,
} from '../../../services/listener/PodcastDetails';
import ProfileIcon from '../../../assets/svg/ProfileIcon';
import { getLocalStorage, showToastMessage } from '../../../utils';
import { TOASTER_STATUS } from '../../../constant';
import ColorStart from '../../../assets/svg/ColorStart';

interface IAuthor {
  authorBio: string;
  authorFirstName: string;
  authorLastName: string;
  authorProfilePhotoUrl: string;
  authorUuid: string;
  avgAuthorRating: number;
  country: string;
  rating: number;
  subscribe: boolean;
}
interface IProps {
  author: IAuthor;
}

const AuthorDetails: React.FC<IProps> = ({ author }) => {
  const [authorDetails, setAuthorDetails] = useState<IAuthor>(author);

  const [isSubscribe, setIsSubscribe] = useState(false);
  const [rating, setRating] = useState(0);
  const [authorSubscribeAndRatingDetails, setAuthorSubscribeAndRatingDetails] = useState<any>(null);

  const isAuthenticated = getLocalStorage('accessToken');

  const handleSubscribeDetail = (value: boolean) => setIsSubscribe(value);
  const doSubscribeUnscribeAuthor = (
    authorUuid: string,
    subscirbe: boolean,
  ) => {
    if (isAuthenticated) {
      subscribeUnscribeAuthor(handleSubscribeDetail, authorUuid, subscirbe);
    } else {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        <>
          <span className='m-r-10'>Login Required! </span>
          <Link to='/login'>login</Link>
        </>,
      );
    }
  };

  const handleAuthorDetails = (
    avgAuthorRating: number,
    selectedRating: number,
  ) => {
    setAuthorDetails({ ...authorDetails, avgAuthorRating });
    setRating(selectedRating);
  };

  const doRateAuthor = (authorUuid: string, rating: number) => {
    rateAuthor(handleAuthorDetails, authorUuid, rating);
  };

  const handleStarClick = (authorUuid: string, selectedRating: any) => {
    if (isAuthenticated) {
      doRateAuthor(authorUuid, selectedRating);
    } else {
      showToastMessage(
        TOASTER_STATUS.ERROR,
        <>
          <span className='m-r-10'>Login Required! </span>
          <Link to='/login'>login</Link>
        </>,
      );
    }
  };

  const handleAuthorSubscribeandRatingDetail = (details: any) => {
    setAuthorSubscribeAndRatingDetails(details);
  };
  const doGetAuthorSubscirbeAndRatingDetails = (authorUuid: string) => {
    getAuthorSubscirbeAndRatingDetails(
      handleAuthorSubscribeandRatingDetail,
      authorUuid,
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      doGetAuthorSubscirbeAndRatingDetails(authorDetails?.authorUuid);
    }
  }, [author]);

  useEffect(() => {
    setRating(authorSubscribeAndRatingDetails?.rating);
    setIsSubscribe(authorSubscribeAndRatingDetails?.subscribe);
  }, [authorSubscribeAndRatingDetails]);

  return (
    <div className='author-subscribe'>
      <div className='d-flex'>
        <div
          className={`d-flex flex-column position-relative ${
            !authorDetails?.authorProfilePhotoUrl ? 'default-icon' : ''
          }`}
        >
          {authorDetails?.authorProfilePhotoUrl ? (
            <img
              src={
                authorDetails?.authorProfilePhotoUrl
                && authorDetails.authorProfilePhotoUrl.startsWith('https://lh3.googleusercontent.com')
                  ? authorDetails.authorProfilePhotoUrl
                  : CLOUDINARY_URL + authorDetails.authorProfilePhotoUrl
              }
              alt='Author-images'
              className='img-fluid'
            />
          ) : (
            <ProfileIcon height={190} width={190} />
          )}
          {!isSubscribe ? (
            // eslint-disable-next-line
            <span
              onClick={() => {
                doSubscribeUnscribeAuthor(authorDetails?.authorUuid, true);
              }}
              className='subscribe-listener'
            >
              <SvgIcons iconType='notification-icon' />
              Subscribe
            </span>
          ) : (
            // eslint-disable-next-line
            <span
              onClick={() => {
                doSubscribeUnscribeAuthor(authorDetails?.authorUuid, false);
              }}
              className='subscribe-listener subscribed'
            >
              <SvgIcons iconType='notification-icon' />
              Subscribed
            </span>
          )}
        </div>
        <div className='w-100 m-l-10'>
          <div className='listerner-star'>
            <div className='author-details'>
              <p className='m-0'>{`${authorDetails?.authorFirstName} ${authorDetails?.authorLastName}`}</p>
              <p className='m-0 p-grey'>Author</p>
              <p className='mb-0 pb-1 p-grey'>
                {'Nationality: '}
                <span>{authorDetails?.country}</span>
              </p>
            </div>

            <div className='d-flex justify-content-between avg-rating'>
              <div>
                <p>Avg rating</p>
                <div className='d-flex align-items-center'>
                  {authorDetails.avgAuthorRating.toFixed(1)}
                  <span className='ms-1 m-t-n6'>
                    <ColorStart />
                  </span>
                </div>
              </div>
              <div>
                <p>Add your rating</p>
                <div className='star-line author-rating'>
                  {[...Array(5)].map((star, index) => {
                    const starValue = index + 1;

                    return (
                      // eslint-disable-next-line
                      <label key={index}>
                        <input
                          type='radio'
                          name='rating'
                          value={starValue}
                          onClick={() => handleStarClick(
                            authorDetails?.authorUuid,
                            starValue,
                          )}
                        />

                        {starValue <= rating ? (
                          <span className='cursor-pointer'>
                            <ColorStart />
                          </span>
                        ) : (
                          <span className='cursor-pointer'>
                            <SvgIcons iconType='star-icon' />
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='d-flex boi-details'>
        <div className='bio-text'>Bio:</div>
        <div>{authorDetails?.authorBio}</div>
      </div>
    </div>
  );
};

export default AuthorDetails;
