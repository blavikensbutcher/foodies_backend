import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { authConfig } from "../config/auth";
import {
  createSession,
  deleteSession,
} from "../repositories/auth.repository";
import * as userRepository from "../repositories/user.repository";
import { ConflictError, UnauthorizedError } from "../errors/AppError";

const SALT_ROUNDS = 10;
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function createToken(userId: string, sessionId: string) {
  return jwt.sign(
    {
      sub: userId,
      sid: sessionId,
    },
    authConfig.jwtSecret,
    {
      expiresIn: "7d",
    }
  );
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

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await userRepository.create({
    name: data.name,
    email: data.email,
    passwordHash,
  });

  const session = await createSession({
    userId: user.id,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
  });

  const token = createToken(user.id, session.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    token,
  };
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const user = await userRepository.findByEmail(data.email);

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const session = await createSession({
    userId: user.id,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
  });

  const token = createToken(user.id, session.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    token,
  };
}

export async function logoutUser(sessionId: string) {
  await deleteSession(sessionId);
}