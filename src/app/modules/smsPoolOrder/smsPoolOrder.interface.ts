import { SmsPoolOrder } from '@prisma/client';
import { IOrderHistory } from '../../../helpers/smsPoolRequest';

export type ISmsPoolOrderFilters = {
  searchTerm?: string;
};

// create new type for smsPoolOrder details with smsPoolOrder history response type

export type ISmsPoolOrderDetails = {
  info: SmsPoolOrder;
  details: IOrderHistory;
};
