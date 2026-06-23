import * as attendanceRepo from './attendance.repository';

export const getAttendance = async (libraryId: string, query: any) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filters = {
    studentId: query.studentId,
    date: query.date,
  };

  const { attendance, total } = await attendanceRepo.getAttendance(libraryId, filters, skip, limit);

  return {
    attendance,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const checkIn = async (studentId: string, libraryId: string) => {
  // We assume the student belongs to the library based on controller validations
  const now = new Date();
  const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return attendanceRepo.checkIn(studentId, dateOnly, now);
};

export const checkOut = async (studentId: string, libraryId: string) => {
  const now = new Date();
  const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return attendanceRepo.checkOut(studentId, dateOnly, now);
};
