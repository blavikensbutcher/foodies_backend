import { UnauthorizedError } from "../errors/AppError";
import { AuthContext } from "../types/auth.types";

export function getAuthUserId(req: { auth?: AuthContext }): string {
  if (!req.auth) {
    throw new UnauthorizedError();
  }

  return req.auth.userId;
}
