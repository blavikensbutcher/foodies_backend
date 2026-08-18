import { Request, Response } from "express";
import * as testimonialService from "../services/testimonial.service";
import * as userRepository from "../repositories/user.repository";
import { NotFoundError } from "../errors/AppError";
import { ERROR_MESSAGES } from "../errors/error.constants";

export async function getAll(_req: unknown, res: Response) {
  const testimonials = await testimonialService.getAll();
  res.json(testimonials);
}

export async function getByUserId(
  req: Request<{ userId: string }>,
  res: Response,
) {
  const { userId } = req.params;

  const user = await userRepository.findById(userId);

  if (!user) throw new NotFoundError(`${ERROR_MESSAGES.USER_NOT_FOUND}`);

  const testimonials = await testimonialService.getByUserId(userId);

  res.json(testimonials);
}
