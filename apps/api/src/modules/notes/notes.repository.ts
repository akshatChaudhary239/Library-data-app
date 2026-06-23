import prisma from '../../config/database';

export const createNote = async (libraryId: string, data: any) => {
  return prisma.note.create({
    data: {
      ...data,
      libraryId,
    },
  });
};

export const getNotes = async (libraryId: string) => {
  return prisma.note.findMany({
    where: { libraryId },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateNote = async (id: string, libraryId: string, data: any) => {
  return prisma.note.update({
    where: { id, libraryId },
    data,
  });
};

export const deleteNote = async (id: string, libraryId: string) => {
  return prisma.note.delete({
    where: { id, libraryId },
  });
};
