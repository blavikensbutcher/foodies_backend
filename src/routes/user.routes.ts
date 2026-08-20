import { Router } from "express";

import * as userController from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

/**
 * @openapi
 * /users/current:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                   nullable: true
 *                 email:
 *                   type: string
 *                 recipesCreatedCount:
 *                   type: integer
 *                   example: 12
 *                 favoriteRecipesCount:
 *                   type: integer
 *                   example: 4
 *                 subscribersCount:
 *                   type: integer
 *                   example: 8
 *                 subscriptionsCount:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/users/current",
  asyncHandler(authenticate),
  asyncHandler(userController.getCurrentUser),
);

/**
 * @openapi
 * /users/me/avatar:
 *   patch:
 *     summary: Update current authenticated user's avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 nullable: true
 *                 example: https://example.com/avatar.jpg
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                   nullable: true
 *                 email:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.patch(
  "/users/me/avatar",
  asyncHandler(authenticate),
  asyncHandler(userController.updateCurrentUserAvatar),
);

/**
 * @openapi
 * /users/me/followers:
 *   get:
 *     summary: Get users following the current authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscribers
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
 *                   avatar:
 *                     type: string
 *                     nullable: true
 *                   email:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/users/me/followers",
  asyncHandler(authenticate),
  asyncHandler(userController.getCurrentUserFollowers),
);

/**
 * @openapi
 * /users/me/following:
 *   get:
 *     summary: Get users followed by the current authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscriptions
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
 *                   avatar:
 *                     type: string
 *                     nullable: true
 *                   email:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/users/me/following",
  asyncHandler(authenticate),
  asyncHandler(userController.getCurrentUserFollowing),
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get another user's profile by id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       200:
 *         description: The requested user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                   nullable: true
 *                 email:
 *                   type: string
 *                 recipesCreatedCount:
 *                   type: integer
 *                   example: 12
 *                 subscribersCount:
 *                   type: integer
 *                   example: 8
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get(
  "/users/:id",
  asyncHandler(authenticate),
  asyncHandler(userController.getUserProfileById),
);

/**
 * @openapi
 * /users/{id}/subscribe:
 *   post:
 *     summary: Subscribe to another user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id to subscribe to
 *     responses:
 *       204:
 *         description: Subscribed successfully
 *       400:
 *         description: Invalid request or cannot subscribe to yourself
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.post(
  "/users/:id/subscribe",
  asyncHandler(authenticate),
  asyncHandler(userController.subscribeToUser),
);

/**
 * @openapi
 * /users/{id}/subscribe:
 *   delete:
 *     summary: Unsubscribe from another user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id to unsubscribe from
 *     responses:
 *       204:
 *         description: Unsubscribed successfully
 *       400:
 *         description: Invalid request or cannot unsubscribe from yourself
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete(
  "/users/:id/subscribe",
  asyncHandler(authenticate),
  asyncHandler(userController.unsubscribeFromUser),
);

export default router;
