import { Request, Response } from "express";

import * as authService from "../services/auth.service";
import {
  loginSchema,
  registerSchema,
} from "../utils/auth.validation";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);

  const result = await authService.registerUser(data);

  res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);

  const result = await authService.loginUser(data);

  res.json(result);
}

export async function logout(req: AuthenticatedRequest, res: Response) {
  if (!req.auth) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  await authService.logoutUser(req.auth.sessionId);

  res.status(204).send();
}