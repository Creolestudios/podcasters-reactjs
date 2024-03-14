import React, { useEffect, useState } from 'react';
import '../../../assets/scss/admin-podcaster.scss';
import { useParams } from 'react-router-dom';
import TableWrapper from '../../../components/TableWrapper';
import {
  adminPodcastActionMenuItems,
  podcastsColumns,
} from '../../../constant/table';
import MenuIcon from '../../../assets/svg/MenuIcon';
import ModalWrapper from '../../../components/form/ModalWrapper';
import Loader from '../../../components/Loader/Loader';
import {
  blockPodcast,
  getPodcastbyPodcasterUuid,
} from '../../../services/admin/Podcast';
import SvgIcons from '../../../assets/svg/SvgIcons';
import FormikWrapper from '../../../components/FormikWrapper';
import { blockReasonSchema } from '../../../utils/formValidationSchema';
import FormikTextAreaWrapper from '../../../components/FormikWrapper/FormikTextAreaWrapper';
import { IPodcast } from '../../../types/podcaster';

interface IBlockPodcastPopup {
  show: boolean;
  reason: string;
  data: any;
}

const AdminPodcaster = () => {
  const { podcasterUuid } = useParams();
  const [podcastData, setPodcastData] = useState<IPodcast[] | []>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLoading = (value: boolean) => setIsLoading(value);
  const [blockPodcastPopup, setBlockPodcastPopup] = useState<IBlockPodcastPopup>({
    show: false,
    reason: '',
    data: null,
  });

  const [podcastStatus, setPodcastStatus] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleDisabled = (value: boolean) => setIsDisabled(value);

  const closeBlockPodcastPopup = () => setBlockPodcastPopup({ ...blockPodcastPopup, show: false, reason: '' });

  const handlePodcastDetail = (data: any) => {
    setPodcastData(data?.data);
    setPodcastStatus(data?.data?.blockPodcastPopup);
    setTotal(data?.recordsTotal);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    handleLoading(true);
    getPodcastbyPodcasterUuid(
      handlePodcastDetail,
      handleLoading,
      podcasterUuid || '',
      currentPage,
    );
  }, [currentPage]);

  const getPodcasts = () => podcastData.map((podcast: IPodcast) => ({
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
    conditionalItem: {
      key: podcast?.podcastStatus === 'BLOCK' ? 'unblock' : 'block',
      value: podcast?.podcastStatus === 'BLOCK',
      actionItemKey: 'block',
      iconType: 'admin_block_user',
      IconName: SvgIcons,
    },
    disabled: {
      block: !(
        podcast?.podcastStatus?.toLowerCase() === 'published'
          || podcast?.podcastStatus?.toLowerCase() === 'block'
      ),
    },
  }));

  const onContinue = () => {
    const currSize = total - 1;
    const currPage = Math.ceil(currSize / 8);
    if (currPage < currentPage) {
      setCurrentPage(currPage);
    }
    getPodcastbyPodcasterUuid(
      handlePodcastDetail,
      handleLoading,
      podcasterUuid || '',
      currentPage,
    );
  };

  const handleBlock = (item: any, type: string) => {
    if (type === 'unblock') {
      const data = {
        uuid: item.id,
        blocked: false,
        role: 'ADMIN',
        reason: '',
      };
      blockPodcast(data, closeBlockPodcastPopup, onContinue, handleDisabled);
    } else {
      setBlockPodcastPopup({ ...blockPodcastPopup, show: true, data: item });
    }
  };

  const handleAction = (type: string, id: string) => {
    const item = getPodcasts().find((element: any) => element.id === id);
    if (type === 'block' || type === 'unblock') {
      handleBlock(item, type);
    }
  };

  const handleBlockPodcast = (value: any) => {
    handleDisabled(true);
    const data = {
      uuid: blockPodcastPopup?.data?.id,
      blocked: podcastStatus !== 'BLOCKED',
      role: 'ADMIN',
      reason: value?.reason,
    };
    blockPodcast(data, closeBlockPodcastPopup, onContinue, handleDisabled);
  };

  return (
    <div className='admin-podcaster-page admin-podcast-page content-page'>
      <div className='podcaster-container'>
        <div className='podcaster-table-section'>
          <TableWrapper
            columns={podcastsColumns}
            data={getPodcasts()}
            hasAction
            hasStatus
            hasRatings
            noDataColSpan={9}
            action={{
              MenuIcon,
              items: adminPodcastActionMenuItems,
            }}
            isPagination
            pagination={{
              current: currentPage,
              pageSize: 8,
              total,
              onChange: handlePageChange,
            }}
            hasLoader
            isLoading={isLoading}
            onActionButton={handleAction}
          />
        </div>
      </div>

      {blockPodcastPopup.show && (
        <ModalWrapper
          size='lg'
          show={blockPodcastPopup.show}
          handleClose={closeBlockPodcastPopup}
          className='podcaster-block-popup'
          body={{
            title: 'Reason for Block Podcast',
            content: '',
          }}
          button1={{
            children: '',
            onClick: () => {},
          }}
          customElement={(
            <div className='popup-body-container'>
              <FormikWrapper
                initialValues={{ reason: '' }}
                validationSchema={blockReasonSchema}
                button={{
                  className: 'btn-style w-100 mt-1',
                  children: isDisabled ? <Loader /> : 'Block Now',
                  isDisabled,
                }}
                onSubmit={handleBlockPodcast}
              >
                <FormikTextAreaWrapper
                  label='Reason'
                  name='reason'
                  placeholder='Write here...'
                />
              </FormikWrapper>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default AdminPodcaster;
