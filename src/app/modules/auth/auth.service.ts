import {
  EPayWith,
  EReferralStatus,
  EVerificationOtp,
  User,
  UserRole,
} from '@prisma/client';
import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import createBycryptPassword from '../../../helpers/createBycryptPassword';
import generateFlutterWavePaymentURL from '../../../helpers/createFlutterWaveInvoice';
import createNowPayInvoice from '../../../helpers/creeateInvoice';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import sendEmail from '../../../helpers/sendEmail';
import { EPaymentType } from '../../../interfaces/common';
import EmailTemplates from '../../../shared/EmailTemplates';
import { checkTimeOfOTP, generateOtp } from '../../../shared/generateOTP';
import prisma from '../../../shared/prisma';
import { UserService } from '../user/user.service';
import {
  ILogin,
  ILoginResponse,
  IRefreshTokenResponse,
  IVerifyTokeResponse,
  RefUser,
} from './auth.Interface';
const createUser = async (user: RefUser): Promise<ILoginResponse> => {
  // checking is user buyer
  const { password: givenPassword, referralId, ...rest } = user;
  let newUser;
  const isUserExist = await prisma.user.findUnique({
    where: { email: user.email },
  });
  // check referralId
  if (referralId) {
    const isReferralUserExits = await prisma.user.findUnique({
      where: { id: referralId },
      select: { id: true },
    });

    if (!isReferralUserExits) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Referral is not valid');
    }
  }
  // if seller and already exist
  const otp = generateOtp();
  if (isUserExist?.isVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user already Exits ');
  } else {
    const genarateBycryptPass = await createBycryptPassword(givenPassword);

    // start new  transection  for new user
    // delete that user
    if (isUserExist?.id) {
      await UserService.deleteUser(isUserExist.id);
    }

    // start new  transection  for new user
    newUser = await prisma.$transaction(async tx => {
      let role: UserRole = UserRole.user;
      //gard for making super admin
      if (user?.email === config.mainAdminEmail) {
        role = UserRole.superAdmin;
      }

      const newUserInfo = await tx.user.create({
        data: {
          password: genarateBycryptPass,
          ...rest,
          role,
          isVerified: false,
          isApprovedForSeller: false,
          isVerifiedByAdmin: false,
        },
      });
      await tx.currency.create({
        data: {
          amount: 0,
          ownById: newUserInfo.id,
        },
      });
      //this code is un useable
      // await tx.verificationOtp.deleteMany({
      //   where: { ownById: newUserInfo.id },
      // });
      await tx.verificationOtp.create({
        data: {
          ownById: newUserInfo.id,
          otp: otp,
          type: EVerificationOtp.createUser,
        },
      });
      if (referralId) {
        await tx.referral.create({
          data: {
            ownById: newUserInfo.id,
            referralById: referralId,
            status: EReferralStatus.pending,
            amount: config.referralAmount,
          },
        });
      }
      // is is it seller
      return newUserInfo;
    });
  }

  if (!newUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'failed to create user');
  }
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { password, id, email, name, ...others } = newUser;
  //create access token & refresh token
  const accessToken = jwtHelpers.createToken(
    { userId: id, role: newUser.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId: id, role: newUser.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    user: { email, id, name, ...others },
    accessToken,
    refreshToken,
    otp,
  };
  // eslint-disable-next-line no-unused-vars
};

const loginUser = async (payload: ILogin): Promise<ILoginResponse> => {
  const { email: givenEmail, password } = payload;
  const isUserExist = await prisma.user.findFirst({
    where: { email: givenEmail },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  if (isUserExist.failedLoginAttempt && isUserExist.failedLoginAttempt >= 3) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "We noticed several attempts to access this account with an incorrect password. To protect your information, this account has been locked. Please reset your password using the 'Forgot Password' for enhanced security. "
    );
  }
  if (isUserExist.role === UserRole.seller) {
    if (isUserExist.isApprovedForSeller === false) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Seller does not exits');
    }
  }
  if (
    isUserExist.password &&
    !(await bcryptjs.compare(password, isUserExist.password))
  ) {
    if (isUserExist.failedLoginAttempt === null) {
      await prisma.user.update({
        where: { id: isUserExist.id },
        data: {
          failedLoginAttempt: 1,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: isUserExist.id },
        data: {
          failedLoginAttempt: {
            increment: 1,
          },
        },
      });
    }
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }
  await prisma.user.update({
    where: { id: isUserExist.id },
    data: { failedLoginAttempt: 0 },
  });
  //create access token & refresh token

  const { email, id, role, name, ...others } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    user: { email, id, name, role, ...others },
    accessToken,
    refreshToken,
  };
};
const resendEmail = async (
  givenEmail: string
): Promise<{ otp: number } | null> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: givenEmail },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (isUserExist?.isVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already verified');
  }
  const otp = generateOtp();
  const verificationOtp = await prisma.$transaction(async tx => {
    await tx.verificationOtp.deleteMany({
      where: { ownById: isUserExist.id },
    });
    return await tx.verificationOtp.create({
      data: {
        ownById: isUserExist.id,
        otp: otp,
        type: EVerificationOtp.createUser,
      },
    });
  });

  if (!verificationOtp.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot create verification Otp'
    );
  }

  return {
    otp,
  };
};
const sendForgotEmail = async (
  givenEmail: string
): Promise<{ otp: number }> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: givenEmail },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const otp = generateOtp();
  //create access token & refresh token
  const { email } = isUserExist;

  const verificationOtp = await prisma.$transaction(async tx => {
    await tx.verificationOtp.deleteMany({
      where: { ownById: isUserExist.id },
    });
    return await tx.verificationOtp.create({
      data: {
        ownById: isUserExist.id,
        otp: otp,
        type: EVerificationOtp.forgotPassword,
      },
    });
  });
  if (!verificationOtp.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot create verification Otp'
    );
  }
  await sendEmail(
    { to: email },
    {
      subject: EmailTemplates.verify.subject,
      html: EmailTemplates.verify.html({ token: otp }),
    }
  );
  return {
    otp,
  };
};
const sendWithdrawalTokenEmail = async (
  id: string
): Promise<{ otp: number }> => {
  const isUserExist = await prisma.user.findUnique({
    where: { id: id },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const otp = generateOtp();
  //create access token & refresh token
  const { email } = isUserExist;

  const verificationOtp = await prisma.$transaction(async tx => {
    await tx.verificationOtp.deleteMany({
      where: { ownById: isUserExist.id },
    });
    return await tx.verificationOtp.create({
      data: {
        ownById: isUserExist.id,
        otp: otp,
        type: EVerificationOtp.withdrawalPin,
      },
    });
  });
  if (!verificationOtp.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot create verification Otp'
    );
  }
  await sendEmail(
    { to: email },
    {
      subject: EmailTemplates.verify.subject,
      html: EmailTemplates.verify.html({ token: otp }),
    }
  );
  return {
    otp,
  };
};
const becomeSeller = async (
  id: string,
  payType: EPayWith
): Promise<{ txId: string }> => {
  console.log(payType);
  const isUserExist = await prisma.user.findUnique({
    where: { id },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // is already payed
  if (isUserExist.isPaidForSeller) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already paid');
  }
  let txId;
  if (payType === EPayWith.paystack) {
    // pay stack
    // const uid = generateUniqueId({ length: 20 });
    // const request = await initiatePayment(
    //   config.sellerOneTimePayment,
    //   isUserExist.email,
    //   uid,
    //   EPaymentType.seller,
    //   isUserExist.id,
    //   config.frontendUrl + `/account/sell-your-account`
    // );
    const fluterWave = await generateFlutterWavePaymentURL({
      amount: config.sellerOneTimePayment,
      customer_email: isUserExist.email,
      redirect_url: config.frontendUrl + `/account/sell-your-account`,
      tx_ref: isUserExist.id,
      paymentType: EPaymentType.seller,
    });
    console.log({ fluterWave });
    txId = fluterWave;
  } else {
    const data = await createNowPayInvoice({
      price_amount: config.sellerOneTimePayment,
      order_id: isUserExist.id,
      ipn_callback_url: '/users/nowpayments-ipn',
      order_description: 'Creating Seller Account',
      success_url: config.frontendUrl + `/account/sell-your-account`,
      cancel_url: config.frontendUrl || '',
    });
    txId = data.invoice_url;
  }
  await prisma.user.update({ where: { id }, data: { txId, payWith: payType } });
  console.log(txId);
  return {
    txId,
  };
};
const becomeSellerWithWallet = async (
  id: string,
  payType: EPayWith
): Promise<{ isSeller: boolean }> => {
  console.log(payType);
  const isUserExist = await prisma.user.findUnique({
    where: { id },
    include: {
      Currency: true,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // is already payed
  if (isUserExist.isPaidForSeller) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already paid');
  }
  // does he has enough wallet
  if (!isUserExist.Currency) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Currency not found!');
  }
  if (config.sellerOneTimePayment > isUserExist.Currency.amount) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Not enough money left on your wallet'
    );
  }
  const admin = await prisma.user.findUnique({
    where: { role: 'superAdmin', email: config.mainAdminEmail },
    select: { id: true },
  });
  if (!admin) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin not found!');
  }
  // already have everything
  await prisma.$transaction(async tx => {
    // cut money and add to admin
    const updateCurrency = await tx.currency.update({
      where: { ownById: id },
      data: {
        amount: { decrement: config.sellerOneTimePayment },
      },
    });
    if (0 > updateCurrency.amount) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Something went wrong trying again latter'
      );
    }
    // add money to admin

    await tx.currency.update({
      where: { ownById: admin.id },
      data: { amount: { increment: config.sellerOneTimePayment } },
    });
    await tx.user.update({
      where: { id },
      data: {
        role: 'seller',
        payWith: EPayWith.wallet,
        isPaidForSeller: true,
        isApprovedForSeller: true,
      },
    });
  });
  return {
    isSeller: true,
  };
};
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify to ken
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { id } = verifiedToken;
  // checking deleted user's refresh token

  const isUserExist = await prisma.user.findFirst({ where: { id } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new Access token

  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

const verifySignupToken = async (
  token: number,
  userId: string
): Promise<IVerifyTokeResponse> => {
  //verify token
  // invalid token - synchronous
  // checking deleted user's refresh token

  const isUserExist = await prisma.user.findUnique({ where: { id: userId } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // check is token match and valid
  const isTokenExit = await prisma.verificationOtp.findFirst({
    where: {
      ownById: userId,
      otp: token,
      type: EVerificationOtp.createUser,
    },
  });

  if (!isTokenExit) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OTP is not match');
  }

  // check time validation
  if (checkTimeOfOTP(isTokenExit.createdAt)) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OPT is expired!');
  }

  //generate new Access token

  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  // delete all otp
  await prisma.verificationOtp.deleteMany({
    where: { ownById: isUserExist.id },
  });
  const result = await UserService.updateUser(
    isUserExist.id,
    {
      isVerified: true,
    },
    {}
  );
  if (!result) {
    new ApiError(httpStatus.BAD_REQUEST, 'user not found');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { password, ...rest } = result as User;
  return {
    accessToken: newAccessToken,
    user: rest,
  };
};

const verifyForgotToken = async (
  token: number,
  userEmail: string
): Promise<{ token: number; isValidate: boolean }> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: userEmail },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // check is token match and valid
  const isTokenExit = await prisma.verificationOtp.findFirst({
    where: {
      ownById: isUserExist.id,
      otp: token,
      type: EVerificationOtp.forgotPassword,
    },
  });

  if (!isTokenExit) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OTP is not match');
  }

  // check time validation
  if (checkTimeOfOTP(isTokenExit.createdAt)) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OPT is expired!');
  }

  // delete all otp
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  return {
    token,
    isValidate: true,
  };
};
const changePassword = async ({
  password,
  email,
  prePassword,
  otp,
}: {
  password: string;
  email: string;
  prePassword: string | undefined;
  otp: number | undefined;
}): Promise<ILoginResponse> => {
  // checking is user buyer
  // check is token match and valid
  let result;
  const genarateBycryptPass = await createBycryptPassword(password);

  const isUserExist = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  if (otp) {
    const isTokenExit = await prisma.verificationOtp.findFirst({
      where: {
        ownById: isUserExist.id,
        otp,
        type: EVerificationOtp.forgotPassword,
      },
    });

    if (!isTokenExit) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OTP is not match');
    }
    if (checkTimeOfOTP(isTokenExit.createdAt)) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OPT is expired!');
    }
    result = await prisma.$transaction(async tx => {
      await tx.verificationOtp.deleteMany({
        where: {
          ownById: isUserExist.id,
        },
      });
      return await tx.user.update({
        where: { id: isUserExist.id },
        data: { password: genarateBycryptPass, failedLoginAttempt: 0 },
      });
    });
  } else {
    if (!prePassword) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'pre password in required!');
    }
    if (isUserExist.failedLoginAttempt) {
      if (isUserExist.failedLoginAttempt >= 3) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          `We noticed several attempts to access this account with an incorrect password. To protect your information, this account has been locked. Please reset your password using the Otp option for enhanced security.`
        );
      }
    }
    // check
    const isMatch = await bcryptjs.compare(prePassword, isUserExist.password);
    if (!isMatch) {
      await prisma.user.update({
        where: { id: isUserExist.id },
        data: {
          failedLoginAttempt:
            isUserExist.failedLoginAttempt === null ? 0 : { increment: 1 },
        },
      });
      throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong password!');
    }
    result = await prisma.$transaction(async tx => {
      await tx.verificationOtp.deleteMany({
        where: {
          ownById: isUserExist.id,
        },
      });
      return await tx.user.update({
        where: { id: isUserExist.id },
        data: { password: genarateBycryptPass },
      });
    });
  }
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
  //create access token & refresh token
  const accessToken = jwtHelpers.createToken(
    { userId: isUserExist.id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId: isUserExist.id, role: isUserExist.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    user: result,
    accessToken,
    refreshToken,
    otp,
  };
  // eslint-disable-next-line no-unused-vars
};
const changeWithdrawPin = async ({
  prePassword,
  newPassword,
  id,
  otp,
}: {
  prePassword: string | undefined;
  newPassword: string;
  id: string;
  otp: number | undefined;
}): Promise<{ success: boolean }> => {
  // checking is user buyer
  // check is token match and valid

  const isUserExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  if (!isUserExist.withdrawalPin) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Add a withdrawal pin fast');
  }
  const genarateBycryptPass = await createBycryptPassword(newPassword);
  if (otp) {
    const isTokenExit = await prisma.verificationOtp.findFirst({
      where: {
        ownById: isUserExist.id,
        otp,
        type: EVerificationOtp.withdrawalPin,
      },
    });

    if (!isTokenExit) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OTP is not match');
    }
    if (checkTimeOfOTP(isTokenExit.createdAt)) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OPT is expired!');
    }

    const result = await prisma.$transaction(async tx => {
      await tx.verificationOtp.deleteMany({
        where: {
          ownById: isUserExist.id,
        },
      });
      return await tx.user.update({
        where: { id: isUserExist.id },
        data: { withdrawalPin: genarateBycryptPass },
      });
    });
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
    }
  } else {
    // check pin is match
    if (!prePassword) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'prePassword is required');
    }
    const isMatch = await bcryptjs.compare(
      prePassword,
      isUserExist.withdrawalPin
    );
    if (!isMatch) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Password dose not match!');
    }
    // match let change the passwrod
    const result = await prisma.user.update({
      where: { id },
      data: { withdrawalPin: genarateBycryptPass },
    });
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
    }
  }

  return {
    success: true,
  };
  // eslint-disable-next-line no-unused-vars
};
const addWithdrawalPasswordFirstTime = async ({
  password,
  userId,
}: {
  password: string;
  userId: string;
}): Promise<{ password: string }> => {
  // checking is user buyer

  const genarateBycryptPass = await createBycryptPassword(password);

  const isUserExist = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  if (isUserExist.withdrawalPin) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password already exits!');
  }
  const result = await prisma.user.update({
    where: { id: isUserExist.id },
    data: { withdrawalPin: genarateBycryptPass },
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }

  return {
    password: genarateBycryptPass,
  };
  // eslint-disable-next-line no-unused-vars
};

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
  verifySignupToken,
  resendEmail,
  verifyForgotToken,
  changePassword,
  sendForgotEmail,
  becomeSeller,
  addWithdrawalPasswordFirstTime,
  sendWithdrawalTokenEmail,
  changeWithdrawPin,
  becomeSellerWithWallet,
};
