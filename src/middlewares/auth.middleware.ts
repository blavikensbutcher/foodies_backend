import { Request } from "express";

export interface AuthenticatedRequest<
  Params = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
> extends Request<Params, ResBody, ReqBody> {
  auth?: {
    userId: string;
    sessionId?: string;
  };
}
