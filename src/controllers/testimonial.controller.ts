import { Request, Response } from "express";
import * as testimonialService from "../services/testimonial.service";

export async function getAll(_req: unknown, res: Response) {
  const testimonials = await testimonialService.getAll();
  res.json(testimonials);
}

export async function getByUserId(req: Request<{ userId: string }>, res: Response) {
  const { userId } = req.params;
  const testimonials = await testimonialService.getByUserId(userId);
  res.json(testimonials);
}
