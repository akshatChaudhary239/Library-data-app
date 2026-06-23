import * as libraryRepo from './library.repository';

export const setupLibrary = async (userId: string, data: any) => {
  const existing = await libraryRepo.getLibraryByUserId(userId);
  if (existing) {
    throw { statusCode: 400, code: 'LIBRARY_EXISTS', message: 'Library already setup for this user' };
  }

  const library = await libraryRepo.createLibrary({
    ...data,
    userId,
  });

  return library;
};

export const getLibrary = async (userId: string) => {
  const library = await libraryRepo.getLibraryByUserId(userId);
  if (!library) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Library not found' };
  }
  return library;
};

export const updateLibrary = async (userId: string, data: any) => {
  const library = await getLibrary(userId);
  const updated = await libraryRepo.updateLibrary(library.id, data);
  return updated;
};

export const getStats = async (userId: string) => {
  const library = await getLibrary(userId);
  const stats = await libraryRepo.getLibraryStats(library.id);
  return stats;
};
