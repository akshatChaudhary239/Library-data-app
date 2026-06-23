import prisma from '../../config/database';

export const getNotifications = async (libraryId: string) => {
  return prisma.notification.findMany({
    where: { libraryId },
    orderBy: { createdAt: 'desc' },
  });
};

export const markAsRead = async (id: string, libraryId: string) => {
  return prisma.notification.update({
    where: { id, libraryId },
    data: { isRead: true },
  });
};

export const markAllAsRead = async (libraryId: string) => {
  return prisma.notification.updateMany({
    where: { libraryId, isRead: false },
    data: { isRead: true },
  });
};
