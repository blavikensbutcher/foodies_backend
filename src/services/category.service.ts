import * as categoryRepository from "../repositories/category.repository";

export async function getAll() {
  return await categoryRepository.findAll();
}
