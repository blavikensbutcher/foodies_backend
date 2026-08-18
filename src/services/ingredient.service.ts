import * as ingredientRepository from "../repositories/ingredient.repository";

export async function getAll() {
  return await ingredientRepository.findAll();
}
