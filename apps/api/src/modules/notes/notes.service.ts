import * as notesRepo from './notes.repository';

export const createNote = async (libraryId: string, data: any) => {
  return notesRepo.createNote(libraryId, data);
};

export const getNotes = async (libraryId: string) => {
  return notesRepo.getNotes(libraryId);
};

export const updateNote = async (id: string, libraryId: string, data: any) => {
  return notesRepo.updateNote(id, libraryId, data);
};

export const deleteNote = async (id: string, libraryId: string) => {
  return notesRepo.deleteNote(id, libraryId);
};
