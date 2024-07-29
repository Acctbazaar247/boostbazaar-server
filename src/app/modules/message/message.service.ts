import { Message, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import sendNotification from '../../../helpers/sendNotification';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import currentTime from '../../../utils/currentTime';
import { messageSearchableFields } from './message.constant';
import { IMessageFilters } from './message.interface';

const getAllMessage = async (
  filters: IMessageFilters,
  paginationOptions: IPaginationOptions,
  orderId: string,
  userId: string
): Promise<IGenericResponse<Message[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const { searchTerm, ...filterData } = filters;
  // const chatGroupId= filterData.chatGroupId;
  const andCondition = [];
  if (searchTerm) {
    const searchAbleFields = messageSearchableFields.map(single => {
      const query = {
        [single]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      };
      return query;
    });
    andCondition.push({
      OR: searchAbleFields,
    });
  }
  if (Object.keys(filters).length) {
    andCondition.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.MessageWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  let result = await prisma.message.findMany({
    where: whereConditions,
    skip,
    // take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? {
            [paginationOptions.sortBy]: paginationOptions.sortOrder,
          }
        : {
            createdAt: 'asc',
          },
    include: {
      sendBy: {
        select: {
          email: true,
          id: true,
          name: true,
          profileImg: true,
        },
      },
    },
  });
  const total = await prisma.message.count();
  const isSeenMessageExits = await prisma.seenMessage.findFirst({
    where: { seenById: userId, orderId: orderId },
  });
  let unSeenCount: number = 0;
  if (isSeenMessageExits) {
    result = result.map(single => {
      const isSeen =
        new Date(isSeenMessageExits.lastSeen) >= new Date(single.createdAt);
      if (!isSeen) {
        unSeenCount++;
      }
      return {
        ...single,
        isSeen,
      };
    });
  }
  const output = {
    data: result,
    meta: { page, limit, total, unSeenCount },
  };
  return output;
};

const createMessage = async (payload: Message): Promise<Message | null> => {
  const isOrderExits = await prisma.orders.findUnique({
    where: { id: payload.orderId },
    select: {
      id: true,
      orderById: true,
      orderBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      account: {
        select: {
          ownById: true,
          name: true,
          ownBy: {
            select: {
              name: true,
              email: true,
              id: true,
            },
          },
        },
      },
    },
  });
  if (!isOrderExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'order is not found');
  }
  const isUserExist = await prisma.user.findUnique({
    where: { id: payload.sendById },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  //
  const newMessage = await prisma.$transaction(async tx => {
    const isSeenMessageExits = await tx.seenMessage.findFirst({
      where: {
        orderId: payload.orderId,
        seenById: payload.sendById,
      },
    });
    if (!isSeenMessageExits) {
      await tx.seenMessage.create({
        data: {
          orderId: payload.orderId,
          seenById: payload.sendById,
          lastSeen: currentTime(),
        },
      });
    } else {
      await tx.seenMessage.updateMany({
        where: {
          orderId: payload.orderId,
          seenById: payload.sendById,
        },
        data: { lastSeen: currentTime() },
      });
    }
    return await tx.message.create({
      data: payload,
      include: {
        sendBy: {
          select: {
            email: true,
            id: true,
            name: true,
            profileImg: true,
          },
        },
      },
    });
  });
  const ownById: string =
    payload.sendById === isOrderExits.orderById
      ? isOrderExits.account.ownById
      : isOrderExits.orderById;
  await sendNotification({
    title: 'New Message',
    message: `You have a new message from ${isUserExist.name}`,
    ownById,
    link: `/order-details/${isOrderExits.id}`,
  });
  // const senderInfo =
  //   payload.sendById === isOrderExits.orderById
  //     ? isOrderExits.orderBy
  //     : isOrderExits.account.ownBy;
  // const recInfo =
  //   payload.sendById !== isOrderExits.orderById
  //     ? isOrderExits.orderBy
  //     : isOrderExits.account.ownBy;
  //sent email
  // sendEmail(
  //   { to: recInfo.email },
  //   {
  //     html: EmailTemplates.sendAMessage.html({
  //       from: senderInfo.name,
  //       productName: isOrderExits.account.name,
  //     }),
  //     subject: EmailTemplates.sendAMessage.subject,
  //   }
  // );
  return newMessage;
};

const getSingleMessage = async (id: string): Promise<Message | null> => {
  const result = await prisma.message.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateMessage = async (
  id: string,
  payload: Partial<Message>
): Promise<Message | null> => {
  const result = await prisma.message.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteMessage = async (id: string): Promise<Message | null> => {
  const result = await prisma.message.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found!');
  }
  return result;
};

export const MessageService = {
  getAllMessage,
  createMessage,
  updateMessage,
  getSingleMessage,
  deleteMessage,
};
