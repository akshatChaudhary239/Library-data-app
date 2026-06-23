import prisma from '../../config/database';

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    include: { library: true }
  });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: { library: true }
  });
};

export const createUser = async (data: any) => {
  return prisma.user.create({
    data,
  });
};

export const createRefreshToken = async (token: string, userId: string, expiresAt: Date) => {
  return prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
};

export const findRefreshToken = async (token: string) => {
  return prisma.refreshToken.findUnique({
    where: { token },
  });
};

export const deleteRefreshToken = async (token: string) => {
  return prisma.refreshToken.delete({
    where: { token },
  });
};

export const deleteAllRefreshTokensForUser = async (userId: string) => {
  return prisma.refreshToken.deleteMany({
    where: { userId },
  });
};
