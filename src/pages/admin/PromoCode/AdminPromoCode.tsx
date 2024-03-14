import React, { useEffect, useState } from 'react';
import '../../../assets/scss/admin-listener.scss';
import ButtonWrapper from '../../../components/form/ButtonWrapper';
import TableWrapper from '../../../components/TableWrapper';
import { adminPromoCodesColumns } from '../../../constant/table';
import MenuIcon from '../../../assets/svg/MenuIcon';
import SvgIcons from '../../../assets/svg/SvgIcons';
import ModalWrapper from '../../../components/form/ModalWrapper';
import Loader from '../../../components/Loader/Loader';
import {
  deletePromoCode,
  getPromoCodeDetails,
} from '../../../services/admin/PromoCode';
import { IPromoCode } from '../../../types/admin';
import AddOrEditPromoCodeModal from './AddOrEditPromoCodeModal';
import { getDate } from '../../../utils';

const AdminPromoCode = () => {
  const [promoCodesData, setPromoCodesData] = useState<IPromoCode[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedPromoCodeId, setSelectedPromoCodeId] = useState<string>('');
  const [openCreateOrEditPromoCodeModal, setOpenCreateOrEditPromoCodeModal] = useState<boolean>(false);
  const [openDeleteConformationModal, setOpenDeleteConformationModal] = useState<boolean>(false);

  const handleLoading = (value: boolean) => setIsLoading(value);
  const handleCloseDeleteConformationModal = () => {
    setSelectedPromoCodeId('');
    setOpenDeleteConformationModal(false);
  };

  const handlePromoCodeData = (data: {
    data: IPromoCode[];
    recordsTotal: number;
    recordsFiltered: number;
  }) => {
    setPromoCodesData(data?.data);
    setTotal(data?.recordsTotal);
  };

  useEffect(() => {
    handleLoading(true);
    getPromoCodeDetails(handlePromoCodeData, handleLoading);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    handleLoading(true);
    getPromoCodeDetails(handlePromoCodeData, handleLoading, currentPage);
  }, [currentPage]);

  const getPromoCodes = () => promoCodesData?.map((promocode: IPromoCode) => ({
    'Promo Code': promocode.couponName,
    Discount:
        promocode.couponOffType === 'PERCENTAGE'
          ? `${promocode.discount}%`
          : `$${promocode.discount}`,
    'Uses Limit':
        promocode.coupounUsageType === 'UNLIMITED'
          ? 'Unlimited'
          : `${promocode.maxRedemptions} Users`,
    'Start Date & Time': getDate(
      String(promocode.couponStartDate),
      'Do MMM yy, hh:mm A',
    ),
    'End Date & Time': getDate(
      String(promocode.couponEndDate),
      'Do MMM yy, hh:mm A',
    ),
    Plan:
        promocode.applicableTo === 'USER'
          ? 'All'
          : promocode.planOrUserIds.join(', '),
    id: promocode.uuid,
  }));

  const onContinue = () => {
    setOpenDeleteConformationModal(false);
    const currSize = total - 1;
    const currPage = Math.ceil(currSize / 8);
    if (currPage < currentPage) {
      setCurrentPage(currPage);
    }
    getPromoCodeDetails(handlePromoCodeData, handleLoading, currentPage);
  };

  const adminPromoCodeActionMenuItems = [
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

  const handleDelete = async (item: IPromoCode) => {
    if (item?.uuid) {
      setSelectedPromoCodeId(item?.uuid);
      setOpenDeleteConformationModal(true);
    }
  };

  const onConfirmDelete = () => {
    setIsDeleting(true);
    deletePromoCode(
      selectedPromoCodeId,
      (value: boolean) => setIsDeleting(value),
      onContinue,
    );
  };

  const handleAction = (type: string, uuid: string) => {
    const item = promoCodesData.find(
      (element: IPromoCode) => element?.uuid === uuid,
    );
    if (type === 'delete' && item) {
      handleDelete(item);
    }
  };

  return (
    <div className='admin-listener-page content-page'>
      <div className='listener-container'>
        <div className='d-flex align-items-center justify-content-end pb-3'>
          <div className='d-lg-flex block'>
            <ButtonWrapper
              onClick={() => setOpenCreateOrEditPromoCodeModal(true)}
            >
              Add New
            </ButtonWrapper>
          </div>
        </div>
        <div className='listener-table-section'>
          <TableWrapper
            columns={adminPromoCodesColumns}
            data={getPromoCodes()}
            hasAction
            noDataColSpan={7}
            action={{
              MenuIcon,
              items: adminPromoCodeActionMenuItems,
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

      <AddOrEditPromoCodeModal
        open={openCreateOrEditPromoCodeModal}
        close={() => {
          setSelectedPromoCodeId('');
          setOpenCreateOrEditPromoCodeModal(false);
        }}
        handleRefetchData={() => getPromoCodeDetails(handlePromoCodeData, handleLoading, currentPage)}
      />

      {openDeleteConformationModal && (
        <ModalWrapper
          size='sm'
          show={openDeleteConformationModal}
          handleClose={handleCloseDeleteConformationModal}
          body={{
            title: 'Are you sure you want to Delete this promocode?',
            content: '',
            icon: {
              Element: SvgIcons,
              type: 'icon-delete',
            },
          }}
          button1={{
            children: 'No',
            onClick: handleCloseDeleteConformationModal,
            isDisabled: isDeleting,
          }}
          button2={{
            children: isDeleting ? <Loader /> : 'Yes',
            onClick: onConfirmDelete,
            isDisabled: isDeleting,
          }}
          isButton
          className='listener-delete-modal'
        />
      )}
    </div>
  );
};

export default AdminPromoCode;
