import * as dashboardRepo from './dashboard.repository';

export const getDashboardData = async (libraryId: string) => {
  return dashboardRepo.getDashboardMetrics(libraryId);
};
