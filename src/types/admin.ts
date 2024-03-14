export interface IListener {
  activePlan: string | null;
  downloadCount: number;
  email: string;
  firstName: string | null;
  invitationStatus: string | null;
  lastName: string | null;
  userStatus: string | null;
  uuid: string;
}
export interface IPodcaster {
  averageRating: number;
  email: string;
  episodeCount: number;
  firstName: string | null;
  invitationStatus: string | null;
  lastName: string | null;
  subscriberCount: number;
  userStatus: string;
  uuid: string;
  viewsCount: number;
}

export interface IPromoCode {
  uuid?:string;
  couponName: string,
  couponOffType: 'PERCENTAGE' | 'FLAT',
  discount: 0,
  applicableTo: 'PLAN' | 'USER',
  planOrUserIds: string[],
  applicableToAll: boolean,
  coupounUsageType: 'LIMITED' | 'UNLIMITED',
  maxRedemptions: number,
  couponStartDate: number | string,
  couponEndDate: number | string,
}
