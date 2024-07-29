import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  startOfDay,
} from 'date-fns';
import prisma from '../../../shared/prisma';
function calculateDaysLeft(createdAt: Date, days: number): number {
  const expirationDate = endOfDay(addDays(createdAt, days - 1)); // Calculate the expiration date at the end of the last day
  const today = new Date(); // Get today's date

  // Calculate the difference in days
  const daysLeft = differenceInCalendarDays(expirationDate, today);

  // Return daysLeft, ensuring it's not negative
  return Math.max(daysLeft, 0);
}
async function getAccountsUploadedToday(id: string) {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const accountsUploadedToday = await prisma.account.count({
    where: {
      ownById: id,
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  return accountsUploadedToday;
}
export { getAccountsUploadedToday };

export default calculateDaysLeft;
