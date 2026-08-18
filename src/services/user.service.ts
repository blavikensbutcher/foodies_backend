import * as userRepository from "../repositories/user.repository";
import { NotFoundError } from "../errors/AppError";
import { ERROR_MESSAGES } from "../errors/error.constants";

export async function getUserById(id: string) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new NotFoundError(`${ERROR_MESSAGES.USER_NOT_FOUND} (id: "${id}")`);
  }

  return user;
}
