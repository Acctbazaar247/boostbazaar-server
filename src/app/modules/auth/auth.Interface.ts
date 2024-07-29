import { User } from '@prisma/client';
export type IRefreshTokenResponse = {
  accessToken: string;
};
export type IVerifyTokeResponse = {
  accessToken: string;
  user: Omit<User, 'password'>;
};
export type ILogin = {
  email: string;
  password: string;
};
export type ILoginResponse = {
  accessToken: string;
  user: Omit<User, 'password'>;
  refreshToken?: string;
  otp?: number;
};

export type RefUser = {
  referralId?: string;
} & User;
