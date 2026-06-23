import * as studentsRepo from './students.repository';

export const createStudent = async (libraryId: string, data: any) => {
  return studentsRepo.createStudent({
    ...data,
    libraryId,
  });
};

export const getStudents = async (libraryId: string, query: any) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filters = {
    status: query.status,
    search: query.search,
  };

  const { students, total } = await studentsRepo.getStudents(libraryId, filters, skip, limit);

  return {
    students,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getStudentById = async (id: string, libraryId: string) => {
  const student = await studentsRepo.getStudentById(id, libraryId);
  if (!student) {
    throw { statusCode: 404, code: 'STUDENT_NOT_FOUND', message: 'Student not found' };
  }
  return student;
};

export const updateStudent = async (id: string, libraryId: string, data: any) => {
  await getStudentById(id, libraryId); // Ensure exists
  return studentsRepo.updateStudent(id, libraryId, data);
};

export const deleteStudent = async (id: string, libraryId: string) => {
  await getStudentById(id, libraryId); // Ensure exists
  return studentsRepo.deleteStudent(id, libraryId);
};

export const getExpiringStudents = async (libraryId: string) => {
  return studentsRepo.getExpiringStudents(libraryId, 7);
};

export const getOverdueStudents = async (libraryId: string) => {
  return studentsRepo.getOverdueStudents(libraryId);
};
