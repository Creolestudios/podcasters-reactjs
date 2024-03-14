import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import SearchInputWrapper from '../SearchInputWrapper';
import { IState } from '../../redux/types';
import { useDebounce } from '../../hooks/useDebounce';
import { GET_SEARCH_PODCASTS } from '../../redux/constants/listener/listener';
import {
  setSearchQueryAction,
  getPodcastsBySearchAction,
} from '../../redux/actions/listener/listener';
import {
  getCurrentPage,
  getPageSize,
  getSearchQuery,
} from '../../redux/selectors/listener/listener';
import IconButtonWrapper from '../IconButtonWrapper';
import LeftArrow from '../../assets/svg/LeftArrow';

type GetPodcastsBySearch = (
  search: string,
  page: number,
  size: number,
  handleLoading: (value: boolean) => void
) => void;

interface IProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  pageSize: number;
  currentPage: number;
  getPodcastsBySearchAction: GetPodcastsBySearch;
  isFromMobile?: boolean;
  handleSearchBar?: CallableFunction;
}

const GlobalSearchInput: React.FC<IProps> = ({
  searchQuery,
  setSearchQuery,
  pageSize,
  currentPage,
  getPodcastsBySearchAction,
  isFromMobile,
  handleSearchBar,
}) => {
  const debouncedSearch = useDebounce(searchQuery, 1000);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getSearchParams = (queryName: string) => searchParams.get(queryName) ?? '';
  const handleLoading = (value: boolean) => setIsLoading(value);
  const handleSearchParams = (query: string, page: string, size: string) => {
    setSearchParams(`searchString=${query}&page=${page}&size=${size}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    handleSearchParams(query, getSearchParams('page') || '0', String(pageSize || 10));
  };

  const getListenerSearch = async (
    _searchQuery?: string,
    _currentPage?: number,
    _pageSize?: number,
    _handleLoading?: (value: boolean) => void,
  ) => {
    getPodcastsBySearchAction(
      _searchQuery ?? searchQuery,
      _currentPage ?? currentPage,
      pageSize || 10,
      _handleLoading ?? handleLoading,
    );
  };

  useEffect(() => {
    setSearchQuery(getSearchParams('searchString'));
  }, []);

  useEffect(() => {
    if (location?.pathname?.includes('/search') && !getSearchParams('searchString')) {
      dispatch({
        type: GET_SEARCH_PODCASTS,
        payload: {
          podcasts: [
            {
              uuid: '',
              name: '',
              description: '',
              podcastStatus: '',
              publishedDate: 0,
              user: {
                uuid: '',
                firstName: '',
                lastName: '',
                email: '',
                profilePhotoUrl: '',
                bio: '',
                averageRating: '',
                podcastCount: '',
                episodeCount: '',
                allMonetizedAllPodcast: false,
              },
              podcastTags: [],
              slugUrl: '',
              averageRating: 0,
              numberOfViews: 0,
              monetized: false,
            },
          ],
          total: null,
          filterTotal: null,
          search: '',
        },
      });
      setSearchParams('');
      navigate('/');
    }
  }, [searchParams]);

  useEffect(() => {
    if (debouncedSearch) {
      if (getSearchParams('searchString')) {
        setSearchQuery(getSearchParams('searchString'));
        getListenerSearch(
          getSearchParams('searchString') ? getSearchParams('searchString')! : searchQuery,
          Number(getSearchParams('page')),
          Number(getSearchParams('size')),
        );
        navigate(`/search?${searchParams}`);
      }
      if (!getSearchParams('searchString')) {
        dispatch({
          type: GET_SEARCH_PODCASTS,
          payload: {
            podcasts: [
              {
                uuid: '',
                name: '',
                description: '',
                podcastStatus: '',
                publishedDate: 0,
                user: {
                  uuid: '',
                  firstName: '',
                  lastName: '',
                  email: '',
                  profilePhotoUrl: '',
                  bio: '',
                  averageRating: '',
                  podcastCount: '',
                  episodeCount: '',
                  allMonetizedAllPodcast: false,
                },
                podcastTags: [],
                slugUrl: '',
                averageRating: 0,
                numberOfViews: 0,
                monetized: false,
              },
            ],
            total: null,
            filterTotal: null,
            search: '',
          },
        });
        setSearchParams('');
        navigate('/');
      }
      if (debouncedSearch && getSearchParams('searchString')) {
        navigate(`/search?${searchParams}`);
      }
    }
  }, [debouncedSearch]);
  return (
    <div className='global-search'>
      {isFromMobile && (
        <IconButtonWrapper
          IconName={LeftArrow}
          onClick={() => {
            if (handleSearchBar) {
              handleSearch('');
              navigate('/');
              handleSearchBar(false);
            }
          }}
          className='back-search-btn'
        />
      )}
      <SearchInputWrapper
        searchValue={
          getSearchParams('searchString') ? getSearchParams('searchString') : searchQuery
        }
        handleSearch={handleSearch}
      />
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  pageSize: getPageSize(state),
  searchQuery: getSearchQuery(state),
  currentPage: getCurrentPage(state),
});

const mapDispatchToProps = {
  setSearchQuery: setSearchQueryAction,
  getPodcastsBySearchAction,
};
export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearchInput);
