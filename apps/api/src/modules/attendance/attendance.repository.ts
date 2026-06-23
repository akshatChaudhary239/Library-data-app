import prisma from '../../config/database';

export const getAttendance = async (libraryId: string, filters: any, skip: number, take: number) => {
  const where: any = {
    student: { libraryId }
  };
  
  if (filters.studentId) where.studentId = filters.studentId;
  if (filters.date) {
    where.date = new Date(filters.date);
  }

  const [attendance, total] = await prisma.$transaction([
    prisma.attendance.findMany({
      where,
      skip,
      take,
      orderBy: { date: 'desc' },
      include: {
        student: { select: { id: true, name: true, seatNumber: true } }
      }
    }),
    prisma.attendance.count({ where }),
  ]);

  return { attendance, total };
};

export const checkIn = async (studentId: string, date: Date, time: Date) => {
  return prisma.attendance.upsert({
    where: {
      studentId_date: { studentId, date },
    },
    update: {
      checkInTime: time,
      status: 'PRESENT',
    },
    create: {
      studentId,
      date,
      checkInTime: time,
      status: 'PRESENT',
    },
  });
};

export const checkOut = async (studentId: string, date: Date, time: Date) => {
  return prisma.attendance.upsert({
    where: {
      studentId_date: { studentId, date },
    },
    update: {
      checkOutTime: time,
    },
    create: {
      studentId,
      date,
      checkOutTime: time,
      status: 'PRESENT',
    },
  });
};
