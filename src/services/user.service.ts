import * as userRepository from "../repositories/user.repository";
import { NotFoundError } from "../errors/AppError";

export async function getUserById(id: string) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new NotFoundError(`User with id "${id}" not found`);
  }

  return user;
}
