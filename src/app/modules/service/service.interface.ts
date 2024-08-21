export type IServiceFilters = {
  searchTerm?: string;
};
export type TService = {
  service: string; // Unique ID for the service
  name: string; // Name of the service (e.g., "Facebook Likes")
  rate: string; // Cost per unit of the service
  min: string; // Minimum quantity for an order
  max: string; // Maximum quantity for an order
  dripfeed?: boolean; // Optional field, indicating if the service supports drip feed
  cancel: boolean;
  refile: boolean;
  category: string;
};
