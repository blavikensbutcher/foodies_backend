import crypto from "crypto";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { authConfig } from "../config/auth";
import { config } from "../config/config";

import {
  createPasswordResetToken,
  createSession,
  deleteSession,
  deleteUserSessions,
  findSessionById,
  findValidPasswordResetToken,
  markPasswordResetTokenUsed,
} from "../repositories/auth.repository";

import * as userRepository from "../repositories/user.repository";

import { sendEmail } from "./email.service";
import { passwordResetEmailTemplate } from "../templates/passwordReset.template";
import { logger } from "../config/logger";

import {
  ConflictError,
  UnauthorizedError,
} from "../errors/AppError";

const SALT_ROUNDS = 10;
const PASSWORD_RESET_TOKEN_TTL_MINUTES = 60;

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createAccessToken(userId: string, sessionId: string) {
  return jwt.sign(
    {
      sub: userId,
      sid: sessionId,
      type: "access",
    },
    authConfig.jwtSecret,
    {
      expiresIn: authConfig.accessTokenExpiresIn,
    }
  );
}

function createRefreshToken(userId: string, sessionId: string) {
  return jwt.sign(
    {
      sub: userId,
      sid: sessionId,
      type: "refresh",
    },
    authConfig.jwtSecret,
    {
      expiresIn: authConfig.refreshTokenExpiresIn,
    }
  );
}

function createTokens(userId: string, sessionId: string) {
  return {
    accessToken: createAccessToken(userId, sessionId),
    refreshToken: createRefreshToken(userId, sessionId),
  };
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await userRepository.findByEmail(data.email);

  if (existingUser) {
    throw new ConflictError("Email already in use");
  }

  const passwordHash = await bcrypt.hash(
    data.password,
    SALT_ROUNDS
  );

  const user = await userRepository.create({
    name: data.name,
    email: data.email,
    passwordHash,
  });

  const session = await createSession({
    userId: user.id,
    expiresAt: new Date(
      Date.now() + authConfig.sessionDurationMs
    ),
  });

  const tokens = createTokens(user.id, session.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    ...tokens,
  };
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const user = await userRepository.findByEmail(data.email);

  if (!user) {
    throw new UnauthorizedError(
      "Invalid email or password"
    );
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new UnauthorizedError(
      "Invalid email or password"
    );
  }

  const session = await createSession({
    userId: user.id,
    expiresAt: new Date(
      Date.now() + authConfig.sessionDurationMs
    ),
  });

  const tokens = createTokens(user.id, session.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    ...tokens,
  };
}

export async function refreshUserSession(
  refreshToken: string
) {
  let payload: jwt.JwtPayload;

  try {
    const decoded = jwt.verify(
      refreshToken,
      authConfig.jwtSecret
    );

    if (
      typeof decoded === "string" ||
      decoded.type !== "refresh" ||
      typeof decoded.sub !== "string" ||
      typeof decoded.sid !== "string"
    ) {
      throw new UnauthorizedError(
        "Invalid refresh token"
      );
    }

    payload = decoded;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }

    throw new UnauthorizedError(
      "Invalid or expired refresh token"
    );
  }

  const session = await findSessionById(
    payload.sid as string
  );

  if (
    !session ||
    session.userId !== payload.sub ||
    session.expiresAt <= new Date()
  ) {
    throw new UnauthorizedError(
      "Session is invalid or expired"
    );
  }

  return {
    accessToken: createAccessToken(
      payload.sub as string,
      payload.sid as string
    ),
  };
}

export async function logoutUser(sessionId: string) {
  await deleteSession(sessionId);
}

export async function requestPasswordReset(email: string) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);

  await createPasswordResetToken({
    userId: user.id,
    tokenHash,
    expiresAt: new Date(
      Date.now() + PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000
    ),
  });

  const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${token}`;

  const { subject, text, html } = passwordResetEmailTemplate({
    name: user.name,
    resetUrl,
    expiresInMinutes: PASSWORD_RESET_TOKEN_TTL_MINUTES,
  });

  try {
    await sendEmail({ to: user.email, subject, text, html });
  } catch (error) {
    logger.error("Failed to send password reset email", { error, userId: user.id });
  }
}

export async function resetPassword(token: string, newPassword: string) {
  const tokenHash = hashToken(token);
  const resetToken = await findValidPasswordResetToken(tokenHash);

  if (!resetToken) {
    throw new UnauthorizedError("Invalid or expired reset token");
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await userRepository.updatePasswordHash(resetToken.userId, passwordHash);
  await markPasswordResetTokenUsed(resetToken.id);
  await deleteUserSessions(resetToken.userId);
}