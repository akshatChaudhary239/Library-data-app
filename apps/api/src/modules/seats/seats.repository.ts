import prisma from '../../config/database';
import { SeatStatus } from '@prisma/client';

export const getSeats = async (libraryId: string) => {
  return prisma.seat.findMany({
    where: { libraryId },
    orderBy: { number: 'asc' },
    include: {
      students: {
        where: { status: 'ACTIVE' },
        select: { id: true, name: true }
      }
    }
  });
};

export const getSeatById = async (id: string, libraryId: string) => {
  return prisma.seat.findFirst({
    where: { id, libraryId },
  });
};

export const getSeatByNumber = async (number: number, libraryId: string) => {
  return prisma.seat.findFirst({
    where: { number, libraryId },
  });
};

export const createSeats = async (libraryId: string, totalSeats: number) => {
  const seats = Array.from({ length: totalSeats }, (_, i) => ({
    libraryId,
    number: i + 1,
    status: 'AVAILABLE' as SeatStatus,
  }));
  
  return prisma.seat.createMany({
    data: seats,
    skipDuplicates: true,
  });
};

export const updateSeatStatus = async (id: string, libraryId: string, status: SeatStatus) => {
  return prisma.seat.update({
    where: { id, libraryId },
    data: { status },
  });
};

export const assignStudentToSeat = async (seatId: string, studentId: string, libraryId: string) => {
  return prisma.$transaction(async (tx) => {
    const seat = await tx.seat.update({
      where: { id: seatId, libraryId },
      data: { status: 'OCCUPIED' },
    });

    await tx.student.update({
      where: { id: studentId, libraryId },
      data: { seatNumber: seat.number },
    });

    return seat;
  });
};

export const unassignSeat = async (seatId: string, libraryId: string) => {
  return prisma.$transaction(async (tx) => {
    const seat = await tx.seat.update({
      where: { id: seatId, libraryId },
      data: { status: 'AVAILABLE' },
    });

    await tx.student.updateMany({
      where: { seatNumber: seat.number, libraryId },
      data: { seatNumber: null },
    });

    return seat;
  });
};
