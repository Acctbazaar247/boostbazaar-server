export type IPlanFilters = {
  searchTerm?: string;
  isActive?: string;
};
export type IBasicPlan = {
  id: string;
  ownById: string;
  isActive: boolean;
  planType: 'default';
  limit: number;
  days: string;
  createdAt: Date;
  updatedAt: Date;
};
export type IPlanUploadCount = {
  uploaded: number;
  left: number;
};
