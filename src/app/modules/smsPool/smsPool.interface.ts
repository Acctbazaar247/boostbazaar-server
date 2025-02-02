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
// demo order history
// {
//   "cost": "0.42",
//   "order_code": "ABCDEFGH",
//   "phonenumber": "1234567890",
//   "code": "0",
//   "full_code": "",
//   "short_name": "US",
//   "service": "Service",
//   "status": "pending",
//   "pool": 7,
//   "timestamp": "2024-01-06 17:37:49",
//   "completed_on": "2024-01-06 17:37:49",
//   "expiry": 1704560269,
//   "time_left": 868
// }

export type TSmsPoolOrderHistory = {
  cost: string;
  order_code: string;
  phonenumber: string;
  code: string;
  full_code: string;
  short_name: string;
  service: string;
  status: string;
  pool: number;
  timestamp: string;
  completed_on: string;
  expiry: number;
  time_left: number;
};
