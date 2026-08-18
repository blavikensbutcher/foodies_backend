import * as areaRepository from "../repositories/area.repository";

export async function getAll() {
  return await areaRepository.findAll();
}
