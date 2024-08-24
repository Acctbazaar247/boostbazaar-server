import { Prisma, Tickets } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { ticketsSearchableFields } from './tickets.constant';
import { ITicketsFilters } from './tickets.interface';

const getAllTickets = async (
  filters: ITicketsFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Tickets[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = ticketsSearchableFields.map(single => {
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

  const whereConditions: Prisma.TicketsWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.tickets.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? {
            [paginationOptions.sortBy]: paginationOptions.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
    include: {
      ownBy: {
        select: {
          name: true,
          email: true,
          id: true,
          profileImg: true,
        },
      },
    },
  });
  const total = await prisma.tickets.count({ where: whereConditions });
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createTickets = async (payload: Tickets): Promise<Tickets | null> => {
  const newTickets = await prisma.tickets.create({
    data: payload,
  });
  return newTickets;
};

const getSingleTickets = async (id: string): Promise<Tickets | null> => {
  const result = await prisma.tickets.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateTickets = async (
  id: string,
  payload: Partial<Tickets>
): Promise<Tickets | null> => {
  const result = await prisma.tickets.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteTickets = async (id: string): Promise<Tickets | null> => {
  const result = await prisma.tickets.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tickets not found!');
  }
  return result;
};

export const TicketsService = {
  getAllTickets,
  createTickets,
  updateTickets,
  getSingleTickets,
  deleteTickets,
};
