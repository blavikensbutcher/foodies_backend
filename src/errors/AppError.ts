import { ERROR_MESSAGES } from "./error.constants";

export class AppError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = ERROR_MESSAGES.NOT_FOUND) {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = ERROR_MESSAGES.FORBIDDEN) {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = ERROR_MESSAGES.INVALID_REQUEST) {
    super(400, message);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = ERROR_MESSAGES.INVALID_REQUEST) {
    super(400, message);
    this.name = "BadRequestError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(409, message);
    this.name = "ConflictError";
  }
}
