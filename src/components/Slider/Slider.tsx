import React, { useEffect, useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import PodcastItem from '../Podcast/PodcastItem';
import AdImage from '../../assets/images/Ad_1.jpg';
import './slider.scss';

interface IProps {
  title: string;
  id: string;
  className?: string;
  isSmallMobileScreen: boolean;
  isSmallScreen?: boolean;
  items: Array<any>;
  children?: any;
  isSeeAllHiden?: boolean;
  seeAllText?: string;
  seeAll?: () => void;
  ads?: any;
}

const Slider: React.FC<IProps> = ({
  title,
  id,
  className,
  isSmallMobileScreen,
  isSmallScreen,
  items,
  children,
  isSeeAllHiden,
  seeAllText,
  seeAll,
  ads,
}) => {
  // const [adPosition, setAdPosition] = useState<number | null>(null);
  const [itemsWithAds, setItemsWithAds] = useState<Array<any>>(items);
  // useEffect(() => {
  //   if (!children && items?.length > 1) {
  //     const randomNumber = Math.floor(Math.random() * (items?.length || 0));
  //     setAdPosition(randomNumber);

  //     const updatedItems = [
  //       ...items.slice(0, randomNumber),
  //       ads.src || AdImage,
  //       ...items.slice(randomNumber),
  //     ];
  //     setItemsWithAds(updatedItems);
  //   }
  // }, []);
  const splideOptions = {
    perPage: 4,
    pagination: false,
    gap: '1rem',
    breakpoints: {
      320: {
        perPage: 2,
      },
      400: {
        perPage: 2,
      },
      575: {
        perPage: 2,
      },
      992: {
        perPage: 3,
      },
    },
  };
  return items?.length ? (
    <div className={className}>
      <div className='my-md-5 my-3' key={id}>
        <div className='mt-0'>
          <div className='row'>
            <div className='col-lg-12'>
              <div className='slider-head'>
                <div className='heading main-title slider-control d-flex justify-content-between line-height-30'>
                  <div>{title}</div>
                  <div className='d-md-none d-sm-flex'>
                    <span className='ml-4 fs-4 cursor-pointer'>
                      {!isSeeAllHiden && (
                        <u>
                          {/* eslint-disable-next-line */}
                          <span onClick={seeAll}>See All</span>
                        </u>
                      )}
                    </span>
                  </div>
                </div>
                <div className='slider-control d-none d-md-flex'>
                  <div className={isSmallMobileScreen ? 'd-flex' : ''}>
                    <span className='ml-4 fs-4 cursor-pointer'>
                      {!isSeeAllHiden && (
                        <u>
                          {/* eslint-disable-next-line */}
                          <span onClick={seeAll}>{seeAllText}</span>
                        </u>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`listener-slider ${isSeeAllHiden && 'hidden'}`}>
          {children || (
            <Splide options={splideOptions}>
              {itemsWithAds?.map((podcast: any, index: number) => (
                <SplideSlide key={podcast?.uuid}>
                  {/* {index !== adPosition ? ( */}
                  <PodcastItem podcast={podcast} />
                  {/* ) : (
                    // eslint-disable-next-line
                    <div
                      className='podcast-frame cursor-pointer h-100'
                      onClick={() => {
                        if (ads.link) {
                          window.location.href = ads.link || '';
                        }
                      }}
                    >
                      <img src={ads.src || AdImage} alt='ad' className='img-fluid' />
                    </div>
                  )
                  } */}
                </SplideSlide>
              ))}
            </Splide>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

Slider.defaultProps = {
  className: '',
  children: null,
  isSmallScreen: false,
  isSeeAllHiden: false,
  seeAllText: 'SEE ALL',
  seeAll: () => {},
  ads: {},
};

export default Slider;
