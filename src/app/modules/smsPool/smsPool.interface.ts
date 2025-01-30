export type ISmsPoolFilters = {
  searchTerm?: string;
};
export type TSmsPoolService = {
  ID: number;
  name: string;
  favourite: number;
};

export type TSmsPoolServiceCountry = {
  country: number;
  success_rate: string;
  price: string;
  low_price: string;
  country_id: number;
  name: string;
  short_name: string;
};
