import prisma from '../../config/database';
import { PaymentMethod } from '@prisma/client';

export const createPayment = async (data: any) => {
  return prisma.payment.create({
    data,
    include: {
      student: {
        select: {
          name: true,
          phone: true,
          library: {
            select: { name: true, address: true, phone: true }
          }
        }
      }
    }
  });
};

export const getPayments = async (libraryId: string, filters: any, skip: number, take: number) => {
  const where: any = {
    student: { libraryId }
  };
  
  if (filters.studentId) where.studentId = filters.studentId;
  if (filters.month) {
    const startOfMonth = new Date(filters.month);
    const endOfMonth = new Date(filters.month);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    
    where.monthCovered = {
      gte: startOfMonth,
      lt: endOfMonth,
    };
  }

  const [payments, total] = await prisma.$transaction([
    prisma.payment.findMany({
      where,
      skip,
      take,
      orderBy: { paymentDate: 'desc' },
      include: {
        student: { select: { id: true, name: true } }
      }
    }),
    prisma.payment.count({ where }),
  ]);

  return { payments, total };
};

export const getPaymentById = async (id: string, libraryId: string) => {
  return prisma.payment.findFirst({
    where: { 
      id,
      student: { libraryId }
    },
    include: {
      student: {
        select: {
          name: true,
          phone: true,
          library: {
            select: { name: true, address: true, phone: true }
          }
        }
      }
    }
  });
};

export const updatePayment = async (id: string, data: any) => {
  return prisma.payment.update({
    where: { id },
    data,
  });
};

export const deletePayment = async (id: string) => {
  return prisma.payment.delete({
    where: { id },
  });
};
