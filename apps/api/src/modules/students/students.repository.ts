import prisma from '../../config/database';

export const createStudent = async (data: any) => {
  return prisma.student.create({
    data,
  });
};

export const getStudents = async (libraryId: string, filters: any, skip: number, take: number) => {
  const where: any = { libraryId };
  if (filters.status) where.status = filters.status;
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { phone: { contains: filters.search } },
    ];
  }

  const [students, total] = await prisma.$transaction([
    prisma.student.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { seat: true },
    }),
    prisma.student.count({ where }),
  ]);

  return { students, total };
};

export const getStudentById = async (id: string, libraryId: string) => {
  return prisma.student.findFirst({
    where: { id, libraryId },
    include: {
      seat: true,
      payments: { orderBy: { paymentDate: 'desc' } },
      attendances: { orderBy: { date: 'desc' }, take: 10 },
      subscriptions: { orderBy: { startDate: 'desc' } },
    },
  });
};

export const updateStudent = async (id: string, libraryId: string, data: any) => {
  return prisma.student.update({
    where: { id, libraryId },
    data,
  });
};

export const deleteStudent = async (id: string, libraryId: string) => {
  return prisma.student.delete({
    where: { id, libraryId },
  });
};

export const getExpiringStudents = async (libraryId: string, days: number) => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return prisma.student.findMany({
    where: {
      libraryId,
      status: 'ACTIVE',
      subscriptionEndDate: {
        lte: futureDate,
        gte: new Date(),
      },
    },
  });
};

export const getOverdueStudents = async (libraryId: string) => {
  return prisma.student.findMany({
    where: {
      libraryId,
      status: 'EXPIRED',
    },
  });
};
