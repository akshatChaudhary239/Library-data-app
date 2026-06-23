import * as notificationsRepo from './notifications.repository';

export const getNotifications = async (libraryId: string) => {
  return notificationsRepo.getNotifications(libraryId);
};

export const markAsRead = async (id: string, libraryId: string) => {
  return notificationsRepo.markAsRead(id, libraryId);
};

export const markAllAsRead = async (libraryId: string) => {
  return notificationsRepo.markAllAsRead(libraryId);
};
