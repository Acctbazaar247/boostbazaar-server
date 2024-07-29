import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import prisma from '../../shared/prisma';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }

      // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      // check user exits and same role
      const queryUser = await prisma.user.findUnique({
        where: { id: verifiedUser.userId },
        select: {
          role: true,
          id: true,
          isBlocked: true,
        },
      });
      if (!queryUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
      }
      if (queryUser?.isBlocked) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You are blocked!');
      }
      // if (queryUser.role !== verifiedUser.role) {
      //   throw new ApiError(
      //     httpStatus.BAD_REQUEST,
      //     'User role does not matched!'
      //   );
      // }
      req.user = verifiedUser; // role  , userid

      // role diye guard korar jnno
      console.log(queryUser, requiredRoles);
      if (requiredRoles.length && !requiredRoles.includes(queryUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
