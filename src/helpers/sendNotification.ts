import { Notifications } from '@prisma/client';
import prisma from '../shared/prisma';

const sendNotification = async ({
  title,
  message,
  link,
  ownById,
}: {
  title: string;
  message: string;
  link?: string;
  ownById: string;
}) => {
  const data = { title, message, link, ownById } as Notifications;
  await prisma.notifications.create({
    data,
  });
  console.log('created');
};
export default sendNotification;
