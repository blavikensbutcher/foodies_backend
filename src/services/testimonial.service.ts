import * as testimonialRepository from "../repositories/testimonial.repository";

export async function getAll() {
  return await testimonialRepository.findAll();
}

export async function getByUserId(userId: string) {
  return await testimonialRepository.findByUserId(userId);
}
