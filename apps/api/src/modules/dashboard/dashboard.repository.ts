import prisma from '../../config/database';

export const getDashboardMetrics = async (libraryId: string) => {
  const now = new Date();
  
  // Calculate start of current month for revenue
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  // Expirations this week
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const [
    totalStudents,
    activeStudents,
    expiredStudents,
    seatStats,
    revenueThisMonth,
    expiringThisWeek
  ] = await prisma.$transaction([
    prisma.student.count({ where: { libraryId } }),
    prisma.student.count({ where: { libraryId, status: 'ACTIVE' } }),
    prisma.student.count({ where: { libraryId, status: 'EXPIRED' } }),
    prisma.seat.groupBy({ by: ['status'], where: { libraryId }, _count: true }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        student: { libraryId },
        paymentDate: { gte: startOfMonth, lt: endOfMonth }
      }
    }),
    prisma.student.findMany({
      where: {
        libraryId,
        status: 'ACTIVE',
        subscriptionEndDate: { lte: nextWeek, gt: now }
      },
      select: { id: true, name: true, subscriptionEndDate: true }
    }),
  ]);

  return {
    totalStudents,
    activeStudents,
    expiredStudents,
    seatStats,
    revenueThisMonth: revenueThisMonth._sum.amount || 0,
    expiringThisWeek,
  };
};
