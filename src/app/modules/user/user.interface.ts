import { User } from '@prisma/client';

export type IUserFilters = {
  searchTerm?: string;
};
export type TSellerProfileInfo = {
  totalSoldAccount: number;
  totalOrder: number;
  totalAccountApprove: number;
  totalCancelOrder: number;
  totalPositiveReviews: number;
  totalNegativeReviews: number;
  totalReviews: number;
  sellerInfo: Pick<
    User,
    'name' | 'id' | 'profileImg' | 'isVerifiedByAdmin' | 'country' | 'createdAt'
  >;
};
