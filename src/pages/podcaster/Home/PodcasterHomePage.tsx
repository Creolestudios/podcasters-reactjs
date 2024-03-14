import React, { FC, useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';

import ButtonWrapper from '../../../components/form/ButtonWrapper';
import TableWrapper from '../../../components/TableWrapper';
import { PODCASTER_APP_ROUTES as PODCASTER_ROUTES } from '../../../constant/appRoute';
import {
  podcastsActionMenuItems,
  podcastsColumns,
} from '../../../constant/table';
import FullPageLoader from '../../../components/Loader/FullPageLoader';
import NestedSelectWrapper, {
  INestedSelectItem,
} from '../../../components/Dropdown/NestedSelectWrapper';
import SearchInputWrapper from '../../../components/SearchInputWrapper';
import {
  getCurrentPage,
  getPageSize,
  getPodcasts,
  getSearchQuery,
  getTotalPodcasts,
  getColumnId,
  getColumnDirection,
  hasPodcasts,
  getPodcastsFilter,
  getPodcastsFilterParams,
} from '../../../redux/selectors/podcaster/podcast';
import {
  getPodcastsByPodcasterAction,
  setPageAction,
  setSearchQueryAction,
  setPodcastStatusAction,
  getPodcastsFilterAction,
  setPodcastsFilterAction,
  resetPodcastsFilterAction,
  deletePodcastAction,
  resetPageAction,
} from '../../../redux/actions/podcaster/podcast';
import { useDebounce } from '../../../hooks/useDebounce';

import startPodcast from '../../../assets/images/startPodcast.png';
import SvgIcons from '../../../assets/svg/SvgIcons';
import MenuIcon from '../../../assets/svg/MenuIcon';
import { IState } from '../../../redux/types';
import {
  IPodcast,
  IPodcastsFilter,
  IPodcastsFilterParams,
} from '../../../types/podcaster';
import { PODCASTS_FILTER_ITEMS } from '../../../constant';
import ModalWrapper from '../../../components/form/ModalWrapper';
import { IOpen, IUser } from '../../../types';

import '../../../assets/scss/podcaster-home-page.scss';
import { getUser } from '../../../redux/selectors/user';

type GetPodcastsByPodcaster = (
  search: string,
  page: number,
  size: number,
  sortColumnId: string,
  sortDirection: string,
  handleLoading: (value: boolean) => void,
  filterParams: IPodcastsFilterParams
) => void;

type DeletePodcast = (
  id: string,
  search: string,
  page: number,
  size: number,
  sortColumnId: string,
  sortDirection: string,
  handleLoading: (value: boolean) => void,
  filterParams: IPodcastsFilterParams
) => void;

interface IProps {
  podcasts: IPodcast[];
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  total: number | null;
  getPodcastsByPodcasterAction: GetPodcastsByPodcaster;
  sortColumnId: string;
  sortColumnDirection: string;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  setPodcastStatus: GetPodcastsByPodcaster;
  hasPodcasts: boolean;
  getPodcastsFilter: () => void;
  podcastsFilter: IPodcastsFilter;
  filterParams: IPodcastsFilterParams;
  setPodcastsFilter: (value: string | boolean, item: INestedSelectItem) => void;
  resetPodcastsFilter: () => void;
  deletePodcast: DeletePodcast;
  resetPage: () => void;
  user: IUser;
}

const PodcasterHomePage: FC<IProps> = ({
  podcasts,
  currentPage,
  pageSize,
  searchQuery,
  total,
  getPodcastsByPodcasterAction,
  sortColumnId,
  sortColumnDirection,
  setSearchQuery,
  setPage,
  setPodcastStatus,
  hasPodcasts,
  getPodcastsFilter,
  podcastsFilter,
  filterParams,
  setPodcastsFilter,
  resetPodcastsFilter,
  deletePodcast,
  resetPage,
  user,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const debouncedSearch = useDebounce(searchQuery, 200);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<IOpen>({
    isOpen: false,
    id: null,
  });
  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  const handleSearchParams = (
    query: string,
    page: string,
    size: string,
    columnId: string,
    columnDirection: string,
  ) => {
    setSearchParams(
      `searchString=${query}&page=${page}&size=${size}&sortColumn=${columnId}&sortDirection=${columnDirection}`,
    );
  };

  const handleLoading = (value: boolean) => setIsLoading(value);
  const handleTableLoading = (value: boolean) => setIsTableLoading(value);
  const getPodcastsByPodcaster = (
    _searchQuery?: string,
    _currentPage?: number,
    _handleLoading?: (value: boolean) => void,
  ) => getPodcastsByPodcasterAction(
    _searchQuery ?? searchQuery,
    _currentPage ?? currentPage,
    pageSize,
    sortColumnId,
    sortColumnDirection,
    _handleLoading ?? handleTableLoading,
    filterParams,
  );

  const getSearchParams = (queryName: string) => searchParams.get(queryName) ?? '';

  useEffect(() => {
    if (
      user?.userPurchasedPlan
      || (location?.state?.isFromListener
        && user?.activePlanUuidAndEndDate?.activePlanUuid)
    ) {
      handleLoading(true);
      handleSearchParams(
        searchQuery,
        String(currentPage),
        String(pageSize),
        sortColumnId,
        sortColumnDirection,
      );
      getPodcastsFilter();
      setPodcastStatus(
        searchQuery,
        currentPage,
        pageSize,
        sortColumnId,
        sortColumnDirection,
        handleLoading,
        filterParams,
      );
    } else if (
      location?.state?.isFromListener
      && !user?.activePlanUuidAndEndDate?.activePlanUuid
    ) {
      navigate('/podcaster/subscription-plan');
    }
    return () => {
      resetPodcastsFilter();
      resetPage();
    };
  }, []);

  useEffect(() => {
    if ((debouncedSearch || isFiltered) && hasPodcasts) {
      handleTableLoading(true);
      handleSearchParams(
        searchQuery,
        String(currentPage),
        String(pageSize),
        sortColumnId,
        sortColumnDirection,
      );
      getPodcastsByPodcaster(searchQuery, currentPage, handleTableLoading);
    }
  }, [hasPodcasts, debouncedSearch, filterParams, currentPage]);

  const handlePageChange = (page: number) => {
    setPage(page);
    setIsFiltered(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsFiltered(true);
  };

  const onAddPodcast = () => navigate(`${PODCASTER_ROUTES.ROOT}/${PODCASTER_ROUTES.ADD_PODCAST}`);
  const getPodcasts = () => podcasts.map((podcast: IPodcast) => ({
    key: podcast.slugUrl,
    Name: podcast.name,
    Category: podcast.categoryName,
    Status: podcast.podcastStatus,
    Ratings: podcast.podcastRating,
    Type: podcast.podcastTypeName,
    Language: podcast.podcastLanguage,
    Views: podcast.viewsCount,
    Episodes: podcast.episodeCount,
    slug: podcast.slugUrl,
    id: podcast.uuid,
  }));

  const handelFilter = (value: string, item: INestedSelectItem) => {
    setPodcastsFilter(value === 'featured' ? true : value, item);
    setIsFiltered(true);
  };

  const onDelete = (type: string, id: string) => setOpenDelete({
    isOpen: true,
    id,
  });

  const handleClose = () => setOpenDelete({ isOpen: false, id: null });
  const onConfirmDelete = () => {
    handleLoading(true);
    deletePodcast(
      openDelete.id ?? '',
      searchQuery,
      currentPage,
      pageSize,
      sortColumnId,
      sortColumnDirection,
      handleLoading,
      filterParams,
    );
    setOpenDelete({
      isOpen: false,
      id: null,
    });
  };

  return (
    <div className='podcaster-home-container'>
      {isLoading && <FullPageLoader />}

      {!isLoading && podcasts && hasPodcasts && (
        <div className='podcasts-container'>
          <div className='podcasts-header'>
            <div className='main-title mb-3 mb-lg-0'>Podcasts</div>
            <div className='d-lg-flex block'>
              <NestedSelectWrapper
                items={PODCASTS_FILTER_ITEMS}
                placeholder='Filter By'
                iconType='filter-icon'
                IconName={SvgIcons}
                hasIcon
                onSelect={handelFilter}
                subMenu={podcastsFilter}
                reset={resetPodcastsFilter}
              />
              <SearchInputWrapper
                searchValue={
                  getSearchParams('searchString')
                    ? getSearchParams('searchString')
                    : searchQuery
                }
                handleSearch={handleSearch}
              />
              <ButtonWrapper onClick={onAddPodcast}>Add New</ButtonWrapper>
            </div>
          </div>
          <div className='podcasts-table-section'>
            <TableWrapper
              columns={podcastsColumns}
              data={getPodcasts()}
              hasAction
              hasStatus
              hasRatings
              noDataColSpan={9}
              action={{
                MenuIcon,
                items: podcastsActionMenuItems,
              }}
              isPagination
              pagination={{
                current: currentPage,
                pageSize,
                total,
                onChange: handlePageChange,
              }}
              hasLoader
              isLoading={isTableLoading}
              isColumnLink
              linkColumns={[0]}
              onActionButton={onDelete}
            />
          </div>
        </div>
      )}

      {!isLoading
        && podcasts
        && !hasPodcasts
        && searchParams.get('searchString') === '' && (
          <div className='start-podcast-container'>
            <img src={startPodcast} alt='start-podcast' />
            <p>Let&apos;s create or upload your podcast now</p>

            <ButtonWrapper className='mx-auto' onClick={onAddPodcast}>
              Add New Podcast
            </ButtonWrapper>
          </div>
      )}

      {openDelete.isOpen && (
        <ModalWrapper
          size='sm'
          show={openDelete.isOpen}
          handleClose={() => {}}
          body={{
            title: 'Are you sure you want to Delete podcast?',
            content: '',
            icon: {
              Element: SvgIcons,
              type: 'icon-delete',
            },
          }}
          button1={{
            children: 'No',
            onClick: handleClose,
          }}
          button2={{
            children: 'Yes',
            onClick: onConfirmDelete,
          }}
          isButton
          className='podcast-delete-modal'
          isShowCloseButton={false}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  podcasts: getPodcasts(state),
  currentPage: getCurrentPage(state),
  pageSize: getPageSize(state),
  searchQuery: getSearchQuery(state),
  total: getTotalPodcasts(state),
  sortColumnId: getColumnId(state),
  sortColumnDirection: getColumnDirection(state),
  hasPodcasts: hasPodcasts(state),
  podcastsFilter: getPodcastsFilter(state),
  filterParams: getPodcastsFilterParams(state),
  user: getUser(state),
});

const mapDispatchToProps = {
  getPodcastsByPodcasterAction,
  setSearchQuery: setSearchQueryAction,
  setPage: setPageAction,
  setPodcastStatus: setPodcastStatusAction,
  getPodcastsFilter: getPodcastsFilterAction,
  setPodcastsFilter: setPodcastsFilterAction,
  resetPodcastsFilter: resetPodcastsFilterAction,
  deletePodcast: deletePodcastAction,
  resetPage: resetPageAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PodcasterHomePage);
