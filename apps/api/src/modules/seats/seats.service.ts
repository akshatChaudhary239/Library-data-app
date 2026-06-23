import * as seatsRepo from './seats.repository';

export const getSeats = async (libraryId: string) => {
  return seatsRepo.getSeats(libraryId);
};

export const generateSeats = async (libraryId: string, totalSeats: number) => {
  if (totalSeats <= 0) {
    throw { statusCode: 400, code: 'INVALID_INPUT', message: 'totalSeats must be greater than 0' };
  }
  await seatsRepo.createSeats(libraryId, totalSeats);
  return { message: `${totalSeats} seats generated successfully` };
};

export const assignSeat = async (seatId: string, studentId: string, libraryId: string) => {
  const seat = await seatsRepo.getSeatById(seatId, libraryId);
  if (!seat) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Seat not found' };
  }
  if (seat.status === 'OCCUPIED') {
    throw { statusCode: 409, code: 'SEAT_OCCUPIED', message: 'Seat is already occupied' };
  }

  return seatsRepo.assignStudentToSeat(seatId, studentId, libraryId);
};

export const unassignSeat = async (seatId: string, libraryId: string) => {
  const seat = await seatsRepo.getSeatById(seatId, libraryId);
  if (!seat) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Seat not found' };
  }

  return seatsRepo.unassignSeat(seatId, libraryId);
};

export const reserveSeat = async (seatId: string, libraryId: string) => {
  const seat = await seatsRepo.getSeatById(seatId, libraryId);
  if (!seat) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Seat not found' };
  }
  if (seat.status === 'OCCUPIED') {
    throw { statusCode: 409, code: 'SEAT_OCCUPIED', message: 'Cannot reserve an occupied seat' };
  }

  return seatsRepo.updateSeatStatus(seatId, libraryId, 'RESERVED');
};
