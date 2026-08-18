import { Router } from "express";
import * as testimonialController from "../controllers/testimonial.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

/**
 * @openapi
 * /testimonials:
 *   get:
 *     summary: Get all testimonials
 *     description: Returns a list of all testimonials sorted by date in descending order (newest first)
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: List of all testimonials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   testimonial:
 *                     type: string
 *                   owner:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                         nullable: true
 */
router.get("/testimonials", asyncHandler(testimonialController.getAll));

/**
 * @openapi
 * /testimonials/{userId}:
 *   get:
 *     summary: Get testimonials by user id
 *     description: Returns a list of testimonials from a specific user sorted by date in descending order (newest first)
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       200:
 *         description: List of user testimonials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   testimonial:
 *                     type: string
 *                   owner:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                         nullable: true
 */
router.get("/testimonials/:userId", asyncHandler(testimonialController.getByUserId));

export default router;
