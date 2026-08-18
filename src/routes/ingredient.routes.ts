import { Router } from "express";
import * as ingredientController from "../controllers/ingredient.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

/**
 * @openapi
 * /ingredients:
 *   get:
 *     summary: Get all ingredients
 *     description: Returns a list of all ingredients sorted alphabetically by name
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: List of all ingredients
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
 *                   desc:
 *                     type: string
 *                     nullable: true
 *                   img:
 *                     type: string
 *                     nullable: true
 */
router.get("/ingredients", asyncHandler(ingredientController.getAll));

export default router;
