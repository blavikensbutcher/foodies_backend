import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Get all recipe categories
 *     description: Returns a list of all recipe categories sorted alphabetically by name
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all recipe categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 */
router.get("/categories", asyncHandler(categoryController.getAll));

export default router;
