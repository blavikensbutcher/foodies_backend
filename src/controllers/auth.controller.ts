import { Request, Response } from "express";

import * as authService from "../services/auth.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export async function register(req: Request, res: Response) {
  const result = await authService.registerUser({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const result = await authService.loginUser({
    email: req.body.email,
    password: req.body.password,
  });

  res.status(200).json(result);
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (typeof refreshToken !== "string" || !refreshToken) {
    res.status(400).json({
      message: "Refresh token is required",
    });
    return;
  }

  const result = await authService.refreshUserSession(
    refreshToken
  );

  res.status(200).json(result);
}

export async function logout(
  req: AuthenticatedRequest,
  res: Response
) {
  if (!req.auth) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  await authService.logoutUser(req.auth.sessionId);

  res.status(204).send();
}