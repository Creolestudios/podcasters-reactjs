import { Dispatch, SetStateAction } from 'react';

export interface DeleteModalInterface {
  show: boolean;
  closeModal: (value: boolean) => void | Dispatch<SetStateAction<boolean>>;
  loading?: boolean;
  message: string;
  handleDeleteData?: () => void;
}

export interface InviteModalInterface {
  show: boolean;
  onHide: (val?: boolean) => void;
  isBlock?: boolean;
  isAdminLister?: string;
}

export interface AddUserModalInterface {
  show: boolean;
  onHide: (val?: boolean) => void;
  isBlock?: boolean;
  isAdminLister?: string;
}

export interface PaymentModalInterface {
  show: boolean;
  setModalShow: Dispatch<SetStateAction<boolean>>;
  PaymentStatus?: string;
  onHide: (val?: boolean) => void;
}

export interface MicrophonePermissionModalInterface {
  show: boolean;
  onHide: () => void;
}

export interface SuccessModalInterface {
  show: boolean;
  podcastId: {
    id: string;
    uuid: string;
  };
  slugUrl: string | null;
  onHide: () => void;
}
