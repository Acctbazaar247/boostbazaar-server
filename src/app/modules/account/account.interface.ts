import { EPlanType } from '@prisma/client';

export type IAccountFilters = {
  searchTerm?: string;
  maxPrice?: string;
  minPrice?: string;
  category?: string;
  planType?: EPlanType;
};
