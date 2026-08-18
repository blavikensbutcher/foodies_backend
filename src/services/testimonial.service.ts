import * as testimonialRepository from "../repositories/testimonial.repository";

export async function getAll() {
  return await testimonialRepository.findAll();
}
