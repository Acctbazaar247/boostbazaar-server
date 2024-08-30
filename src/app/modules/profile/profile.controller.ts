import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ILoginResponse } from '../auth/auth.Interface';
import { UserService } from '../user/user.service';

const getProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { userId, role } = req.user as JwtPayload;
    console.log(userId, role);
    const result = await UserService.getSingleUser(userId);
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'user not found');
    }
    const accessToken = jwtHelpers.createToken(
      { userId: result.id, role: result?.role },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
    sendResponse<ILoginResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User fetched   successfully',
      data: {
        accessToken: accessToken,
        user: {
          name: result.name,
          id: result.id,
          email: result.email,
          role: result.role,
          shouldSendEmail: result.shouldSendEmail,
          failedLoginAttempt: result.failedLoginAttempt,
          profileImg: result.profileImg,
          createdAt: result.createdAt,
          isBlocked: result.isBlocked,
          isVerified: result.isVerified,
          updatedAt: result.updatedAt,
        },
      },
    });
  }
);

export const ProfileController = {
  getProfile,
};
