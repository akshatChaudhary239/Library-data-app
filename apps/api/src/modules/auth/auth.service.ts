import * as authRepo from './auth.repository';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';

export const signup = async (data: any) => {
  const existingUser = await authRepo.findUserByEmail(data.email);
  if (existingUser) {
    throw { statusCode: 409, code: 'EMAIL_IN_USE', message: 'Email is already in use' };
  }

  const hashedPassword = await hashPassword(data.password);
  
  const user = await authRepo.createUser({
    ...data,
    password: hashedPassword,
  });

  return { user: { id: user.id, email: user.email, name: user.name } };
};

export const login = async (data: any) => {
  const user = await authRepo.findUserByEmail(data.email);
  if (!user) {
    throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
  }

  const isValid = await comparePassword(data.password, user.password);
  if (!isValid) {
    throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
  }

  const payload = {
    userId: user.id,
    libraryId: user.library?.id,
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await authRepo.createRefreshToken(refreshToken, user.id, expiresAt);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      libraryId: user.library?.id,
    }
  };
};

export const refresh = async (refreshToken: string) => {
  const tokenRecord = await authRepo.findRefreshToken(refreshToken);
  
  if (!tokenRecord) {
    throw { statusCode: 401, code: 'INVALID_TOKEN', message: 'Invalid refresh token' };
  }

  if (tokenRecord.expiresAt < new Date()) {
    await authRepo.deleteRefreshToken(refreshToken);
    throw { statusCode: 401, code: 'TOKEN_EXPIRED', message: 'Refresh token has expired' };
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    
    // Fetch fresh user data from database to ensure we get the newly created libraryId
    const user = await authRepo.findUserByEmail(decoded.email);
    if (!user) {
      throw new Error('User not found');
    }

    // Rotate token
    await authRepo.deleteRefreshToken(refreshToken);
    
    const newAccessToken = generateAccessToken({
      userId: user.id,
      libraryId: user.library?.id,
      email: user.email,
    });
    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      libraryId: user.library?.id,
      email: user.email,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await authRepo.createRefreshToken(newRefreshToken, decoded.userId, expiresAt);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (err) {
    await authRepo.deleteRefreshToken(refreshToken);
    throw { statusCode: 401, code: 'INVALID_TOKEN', message: 'Invalid refresh token' };
  }
};

export const logout = async (refreshToken: string) => {
  if (refreshToken) {
    await authRepo.deleteRefreshToken(refreshToken);
  }
};
