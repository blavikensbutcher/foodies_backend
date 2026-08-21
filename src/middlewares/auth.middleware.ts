import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import jwt from "jsonwebtoken";

import { authConfig } from "../config/auth";
import { findSessionById } from "../repositories/auth.repository";
import { AuthContext } from "../types/auth.types";

type AuthPayload = {
  sub: string;
  sid: string;
  type: "access" | "refresh";
};

export interface AuthenticatedRequest<P = ParamsDictionary>
  extends Request<P> {
  auth?: AuthContext;
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Authorization token is required",
    });
    return;
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(
      token,
      authConfig.jwtSecret,
    ) as AuthPayload;

    if (
      !payload.sub ||
      !payload.sid ||
      payload.type !== "access"
    ) {
      res.status(401).json({
        message: "Invalid access token",
      });
      return;
    }

    const session = await findSessionById(payload.sid);

    if (
      !session ||
      session.userId !== payload.sub ||
      session.expiresAt <= new Date()
    ) {
      res.status(401).json({
        message: "Session is invalid or expired",
      });
      return;
    }

    req.auth = {
      userId: payload.sub,
      sessionId: payload.sid,
    };

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
}
