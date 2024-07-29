import { Notifications, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const getAllNotifications = async (
  userId: string
): Promise<Notifications[]> => {
  console.log({ userId });
  const data = await prisma.notifications.findMany({
    where: {
      ownById: userId,
    },
  });
  return data;
};

const createNotifications = async (
  payload: Notifications
): Promise<Notifications | null> => {
  const newNotifications = await prisma.notifications.create({
    data: payload,
  });
  return newNotifications;
};

const getSingleNotifications = async (
  id: string
): Promise<Notifications | null> => {
  const result = await prisma.notifications.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateNotifications = async (
  id: string
): Promise<Prisma.BatchPayload> => {
  const result = await prisma.notifications.updateMany({
    where: {
      ownById: id,
      isSeen: false,
    },
    data: { isSeen: true },
  });
  return result;
};

const deleteNotifications = async (
  id: string
): Promise<Notifications | null> => {
  const result = await prisma.notifications.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notifications not found!');
  }
  return result;
};

export const NotificationsService = {
  getAllNotifications,
  createNotifications,
  updateNotifications,
  getSingleNotifications,
  deleteNotifications,
};
