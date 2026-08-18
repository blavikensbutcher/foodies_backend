import { Response } from "express";
import * as testimonialService from "../services/testimonial.service";

export async function getAll(_req: unknown, res: Response) {
  const testimonials = await testimonialService.getAll();
  res.json(testimonials);
}
