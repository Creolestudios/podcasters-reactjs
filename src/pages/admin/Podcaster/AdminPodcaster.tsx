import React, { useEffect, useState } from 'react';
import '../../../assets/scss/admin-podcaster.scss';
import ButtonWrapper from '../../../components/form/ButtonWrapper';
import TableWrapper from '../../../components/TableWrapper';
import {
  adminPodcasterActionMenuItems,
  adminPodcasterColumns,
} from '../../../constant/table';
import MenuIcon from '../../../assets/svg/MenuIcon';
import { getCountWithSuffix, getUserTitle } from '../../../utils';
import SvgIcons from '../../../assets/svg/SvgIcons';
import ModalWrapper from '../../../components/form/ModalWrapper';
import PlanDropDown from '../Listener/PlanDropDown';
import Loader from '../../../components/Loader/Loader';
import { IPodcaster } from '../../../types/admin';
import {
  getActivePodcasterPlan,
  getPodcasterDetails,
  getPodcasterPlans,
  invitePodcaster,
  blockPodcaster,
  deletePodcaster,
  upgradePodcasterPlan,
} from '../../../services/admin/Podcaster';
import FormikWrapper from '../../../components/FormikWrapper';
import {
  addUserSchema,
  blockReasonSchema,
} from '../../../utils/formValidationSchema';
import FormikTextAreaWrapper from '../../../components/FormikWrapper/FormikTextAreaWrapper';
import FormikFieldWrapper from '../../../components/FormikWrapper/FormikFieldWrapper';

interface IAddNewPodcasterPopup {
  show: boolean;
  email: string;
}
interface IEditPlanPopup {
  show: boolean;
  data: any;
}

interface IDeletePopup {
  show: boolean;
  id: string;
}
interface IBlockUserPopup {
  show: boolean;
  reason: string;
  data: any;
}

export interface ISelectedPlan {
  label: string;
  value: string;
  price: number;
  period: string;
}

export interface IActivePlan {
  planName: string;
  amount: number;
}

const AdminPodcaster = () => {
  const [podcasterData, setPodcasterData] = useState<IPodcaster[] | []>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLoading = (value: boolean) => setIsLoading(value);
  const [addNewPodcasterPopup, setAddNewPodcasterPopup] = useState<IAddNewPodcasterPopup>({
    show: false,
    email: '',
  });
  const [editPlanPopup, setEditPlanPopup] = useState<IEditPlanPopup>({
    show: false,
    data: null,
  });
  const [blockUserPopup, setBlockUserPopup] = useState<IBlockUserPopup>({
    show: false,
    reason: '',
    data: null,
  });
  const [selectedPlan, setSelectedPlan] = useState<ISelectedPlan>({
    label: 'Free Plan',
    value: '',
    price: 0,
    period: 'Monthly',
  });
  const [activePlan, setActivePlan] = useState<IActivePlan | null>(null);
  const [plans, setPlans] = useState<ISelectedPlan[]>([]);
  const [userStatus, setUserStatus] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<IDeletePopup>({
    show: false,
    id: '',
  });

  const handleClose = () => setOpenDelete({ show: false, id: '' });

  const handleDisabled = (value: boolean) => setIsDisabled(value);

  const closeAddPodcasterPopup = () => setAddNewPodcasterPopup({ show: false, email: '' });
  const closeBlockUserPopup = () => setBlockUserPopup({ ...blockUserPopup, show: false, reason: '' });
  const closeEditPlanPopup = () => {
    setEditPlanPopup({ ...editPlanPopup, show: false });
    setActivePlan(null);
  };

  const handleActivePodcasterPlan = (plan: IActivePlan) => {
    setActivePlan(plan);
  };

  const handlePlans = (plans: any, period: string) => {
    const updatedPlans = plans.map((plan: any) => ({
      label: plan.planName,
      value: plan.uuid,
      price: plan.amount,
      period,
    }));

    setTimeout(() => {
      setPlans((prevPlans: ISelectedPlan[]) => {
        // Filter out plans with the same uuid before updating the state
        const filteredPlans = updatedPlans.filter((newPlan: ISelectedPlan) => {
          const plan = !prevPlans.some(
            (existingPlan: ISelectedPlan) => existingPlan.value === newPlan.value,
          );
          return plan;
        });

        return [...prevPlans, ...filteredPlans];
      });
    }, 10);
  };

  const handlePodcasterDetail = (data: any) => {
    setPodcasterData(data?.data);
    setUserStatus(data?.data?.userStatus);
    setTotal(data?.recordsTotal);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    handleLoading(true);
    getPodcasterDetails(handlePodcasterDetail, handleLoading, currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (editPlanPopup.show) {
      getActivePodcasterPlan(
        handleActivePodcasterPlan,
        editPlanPopup?.data?.id,
      );
      getPodcasterPlans(handlePlans, 'MONTHLY');
    }
  }, [editPlanPopup.show]);

  const getPodcasters = () => podcasterData.map((podcaster: any) => ({
    key: podcaster?.uuid,
    Name: getUserTitle(podcaster),
    Email: podcaster?.email,
    Subscribers: getCountWithSuffix(podcaster?.subscriberCount, 'K'),
    Views: getCountWithSuffix(podcaster?.viewsCount, 'K'),
    Episodes: podcaster?.episodeCount,
    Ratings: podcaster?.averageRating.toFixed(1),
    userStatus: podcaster?.userStatus,
    invitationStatus: podcaster?.invitationStatus,
    activePlan: podcaster?.activePlan,
    id: podcaster?.uuid,
    slug: podcaster.uuid,
    navigateState: { headerTitle: `${getUserTitle(podcaster)}'s Podcasts` },
    conditionalItem: {
      key:
          podcaster?.userStatus === 'BLOCKED' ? 'unblock user' : 'block user',
      value: podcaster?.userStatus === 'BLOCKED',
      actionItemKey: 'block user',
      iconType: 'admin_block_user',
      IconName: SvgIcons,
    },
    disabled: {
      'edit plans': !!(
        podcaster?.activePlan === null
          || podcaster?.activePlan?.toLowerCase() === 'free'
      ),
    },
  }));

  const onContinue = () => {
    const currSize = total - 1;
    const currPage = Math.ceil(currSize / 8);
    if (currPage < currentPage) {
      setCurrentPage(currPage);
    }
    getPodcasterDetails(handlePodcasterDetail, handleLoading, currentPage);
  };

  const handleBlock = (item: any, type: string) => {
    if (type === 'unblock user') {
      const data = {
        uuid: item.id,
        blocked: false,
        role: 'PODCASTER',
        reason: '',
      };
      blockPodcaster(data, closeBlockUserPopup, onContinue, handleDisabled);
    } else {
      setBlockUserPopup({ ...blockUserPopup, show: true, data: item });
    }
  };

  const handleDelete = async (item: any) => {
    setOpenDelete({
      show: true,
      id: item?.key,
    });
  };
  const onConfirmDelete = async () => {
    handleDisabled(true);
    handleLoading(true);
    await deletePodcaster(
      openDelete?.id,
      handleLoading,
      handleDisabled,
      onContinue,
    );
    setOpenDelete({
      show: false,
      id: '',
    });
  };

  const handleEditPlans = (item: any) => {
    setEditPlanPopup({ show: true, data: item });
  };

  const handleAction = (type: string, id: string) => {
    const item = getPodcasters().find((element: any) => element.id === id);
    if (type === 'edit plans') {
      handleEditPlans(item);
    } else if (type === 'delete') {
      handleDelete(item);
    } else if (type === 'block user' || type === 'unblock user') {
      handleBlock(item, type);
    }
  };

  const handleBlockPodcaster = (value: any) => {
    handleDisabled(true);
    const data = {
      uuid: blockUserPopup?.data?.key,
      blocked: userStatus !== 'BLOCKED',
      role: 'PODCASTER',
      reason: value?.reason,
    };
    blockPodcaster(data, closeBlockUserPopup, onContinue, handleDisabled);
  };

  return (
    <div className='admin-podcaster-page content-page'>
      <div className='six-box-layout one-row-five'>
        <div className='d-flex align-items-center'>
          <div>
            <h3>55k</h3>
            <p className='m-0'>Total Podcaster</p>
          </div>
        </div>

        <div className='d-flex align-items-center'>
          <div>
            <h3>15k</h3>
            <p className='m-0'>Free Plan User</p>
          </div>
        </div>

        <div className='d-flex align-items-center'>
          <div>
            <h3>3k</h3>
            <p className='m-0'>Basic Plan User</p>
          </div>
        </div>

        <div className='d-flex align-items-center'>
          <div>
            <h3>25k</h3>
            <p className='m-0'>Standard Plan User</p>
          </div>
        </div>

        <div className='d-flex align-items-center'>
          <div>
            <h3>12k</h3>
            <p className='m-0'>Premium Plan User</p>
          </div>
        </div>
      </div>
      <div className='podcaster-container'>
        <div className='podcaster-header'>
          <div className='main-title mb-3 mb-lg-0'>Podcasters</div>
          <div className='d-lg-flex block'>
            <ButtonWrapper
              onClick={() => {
                setAddNewPodcasterPopup({
                  ...addNewPodcasterPopup,
                  show: true,
                });
              }}
            >
              Add New
            </ButtonWrapper>
          </div>
        </div>
        <div className='podcaster-table-section'>
          <TableWrapper
            columns={adminPodcasterColumns}
            data={getPodcasters()}
            hasAction
            hasStatus
            hasRatings
            noDataColSpan={7}
            action={{
              MenuIcon,
              items: adminPodcasterActionMenuItems,
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
            isColumnLink
            linkColumns={[0]}
            onActionButton={handleAction}
          />
        </div>
      </div>

      {addNewPodcasterPopup.show && (
        <ModalWrapper
          size='lg'
          show={addNewPodcasterPopup.show}
          handleClose={closeAddPodcasterPopup}
          className='add-podcaster-popup'
          body={{
            title: 'Add New Podcaster',
            content: '',
          }}
          button1={{
            children: '',
            onClick: () => {},
          }}
          customElement={(
            <div className='popup-body-container'>
              <FormikWrapper
                initialValues={{ email: '' }}
                validationSchema={addUserSchema}
                button={{
                  className: 'btn-style w-100 mt-1',
                  children: isDisabled ? <Loader /> : 'Invite',
                  isDisabled,
                }}
                onSubmit={(value: any) => {
                  handleDisabled(true);
                  invitePodcaster(
                    value?.email,
                    closeAddPodcasterPopup,
                    handleDisabled,
                  );
                }}
              >
                <FormikFieldWrapper
                  label='Email Address'
                  name='email'
                  type='email'
                  placeholder='Enter email'
                />
              </FormikWrapper>
            </div>
          )}
        />
      )}

      {editPlanPopup.show && (
        <ModalWrapper
          size='lg'
          show={editPlanPopup.show}
          handleClose={closeEditPlanPopup}
          className='edit-plan-popup'
          body={{
            title: 'Edit Plan',
            content: '',
          }}
          button1={{
            children: '',
            onClick: () => {},
          }}
          customElement={
            activePlan ? (
              <div className='popup-body-container'>
                <div className='actived-plan'>
                  <span>Activated Plan</span>
                  <div className='info-plan'>
                    <div className='details'>
                      <span className='plan-name'>{activePlan?.planName}</span>
                      <span>|</span>
                      <span className='price'>
                        $
                        {activePlan?.amount}
                      </span>
                    </div>
                    <div className='status'>
                      <span>Active</span>
                    </div>
                  </div>
                </div>
                <div className='upgrade-plan'>
                  <span>Upgrade Plan</span>
                  <PlanDropDown
                    items={plans}
                    onSelect={(event) => {
                      setSelectedPlan(event);
                    }}
                    selectedItem={selectedPlan}
                  />
                </div>
                <div>
                  <ButtonWrapper
                    onClick={() => {
                      handleDisabled(true);
                      upgradePodcasterPlan(
                        selectedPlan?.value,
                        editPlanPopup?.data?.key,
                        closeEditPlanPopup,
                        onContinue,
                        handleDisabled,
                      );
                    }}
                    isDisabled={isDisabled}
                    className='save-btn'
                  >
                    {isDisabled ? <Loader /> : 'Save'}
                  </ButtonWrapper>
                </div>
              </div>
            ) : (
              <Loader />
            )
          }
        />
      )}

      {openDelete?.show && (
        <ModalWrapper
          size='sm'
          show={openDelete?.show}
          handleClose={handleClose}
          body={{
            title: 'Are you sure you want to Delete this user?',
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
            children: isDisabled ? <Loader /> : 'Yes',
            onClick: onConfirmDelete,
            isDisabled,
          }}
          isButton
          className='podcaster-delete-modal'
        />
      )}

      {blockUserPopup.show && (
        <ModalWrapper
          size='lg'
          show={blockUserPopup.show}
          handleClose={closeBlockUserPopup}
          className='podcaster-block-popup'
          body={{
            title: 'Reason for Block Podcaster',
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
                onSubmit={handleBlockPodcaster}
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
