import { Router } from "express";
import * as areaController from "../controllers/area.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

/**
 * @openapi
 * /areas:
 *   get:
 *     summary: Get all regions of origin of dishes
 *     description: Returns a list of all dish origin regions sorted alphabetically by name
 *     tags: [Areas]
 *     responses:
 *       200:
 *         description: List of all regions
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
router.get("/areas", asyncHandler(areaController.getAll));

export default router;
