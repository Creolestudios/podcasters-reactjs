import React from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getSearchedPodcast } from '../../../redux/selectors/listener/listener';
import { IState } from '../../../redux/types';
import { getPodcastsBySearchAction } from '../../../redux/actions/listener/listener';
import Loader from '../../../components/Loader/Loader';
import PodcastItem from '../../../components/Podcast/PodcastItem';
import '../../../assets/scss/search.scss';

type GetPodcastsBySearch = (
  search: string,
  page: number,
  size: number,
  handleLoading: (value: boolean) => void
) => void;

interface IProps {
  searchedResult: any;
  getPodcastsBySearchAction: GetPodcastsBySearch;
}

const ProfilePage: React.FC<IProps> = ({ searchedResult, getPodcastsBySearchAction }) => {
  const fetchMoreData = () => {
    getPodcastsBySearchAction(searchedResult.search || '', 0, searchedResult.size + 10, () => {});
  };

  return (
    <div className='listener-search'>
      <div className='search-page'>
        <div className='my-md-2 my-3 row'>
          <div className='mt-0'>
            <div className='row'>
              <div className='col-lg-12'>
                <div className='slider-head'>
                  <div className='heading main-title slider-control d-flex justify-content-between'>
                    <div>
                      Searched Result :
                      {` ${searchedResult.search}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {searchedResult?.podcasts?.length ? (
          <div id='infinite-scrollbar'>
            <InfiniteScroll
              dataLength={searchedResult?.podcasts?.length}
              next={() => fetchMoreData()}
              hasMore={searchedResult?.total > searchedResult?.filterTotal}
              loader={<Loader />}
            >
              <div className='search-result'>
                {searchedResult?.podcasts?.map((podcast: any) => (
                  <PodcastItem podcast={podcast} className='search-item' />
                ))}
              </div>
            </InfiniteScroll>
          </div>
        ) : (
          <div>No Data Found</div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  searchedResult: getSearchedPodcast(state),
});

const mapDispatchToProps = {
  getPodcastsBySearchAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
