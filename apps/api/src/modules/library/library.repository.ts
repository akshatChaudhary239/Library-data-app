import prisma from '../../config/database';

export const createLibrary = async (data: any) => {
  return prisma.library.create({
    data,
  });
};

export const getLibraryByUserId = async (userId: string) => {
  return prisma.library.findUnique({
    where: { userId },
  });
};

export const updateLibrary = async (id: string, data: any) => {
  return prisma.library.update({
    where: { id },
    data,
  });
};

export const getLibraryStats = async (libraryId: string) => {
  const [totalStudents, activeStudents, expiredStudents, seats] = await prisma.$transaction([
    prisma.student.count({ where: { libraryId } }),
    prisma.student.count({ where: { libraryId, status: 'ACTIVE' } }),
    prisma.student.count({ where: { libraryId, status: 'EXPIRED' } }),
    prisma.seat.groupBy({
      by: ['status'],
      where: { libraryId },
      _count: true,
    }),
  ]);
  return { totalStudents, activeStudents, expiredStudents, seats };
};
