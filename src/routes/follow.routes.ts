import { Router } from "express";

import * as followController from "../controllers/follow.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validateParams } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { UserParamsSchema } from "../utils/user.validation";

const router = Router();

/**
 * @openapi
 * /users/{id}/followers:
 *   get:
 *     summary: Get users who follow the given user
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
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Paginated list of followers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListPage'
 *       400:
 *         description: Invalid pagination params or user id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get(
  "/users/:id/followers",
  asyncHandler(authenticate),
  validateParams(UserParamsSchema),
  asyncHandler(followController.getFollowers),
);

/**
 * @openapi
 * /users/{id}/following:
 *   get:
 *     summary: Get users the given user follows
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
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Paginated list of followed users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListPage'
 *       400:
 *         description: Invalid pagination params or user id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get(
  "/users/:id/following",
  asyncHandler(authenticate),
  validateParams(UserParamsSchema),
  asyncHandler(followController.getFollowing),
);

/**
 * @openapi
 * /users/{id}/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id of the user to follow
 *     responses:
 *       201:
 *         description: The followed user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCard'
 *       400:
 *         description: Invalid user id or cannot follow yourself
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       409:
 *         description: Already following this user
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id of the user to unfollow
 *     responses:
 *       200:
 *         description: The unfollowed user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCard'
 *       400:
 *         description: Invalid user id or cannot unfollow yourself
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       409:
 *         description: Not following this user
 */
router.post(
  "/users/:id/follow",
  asyncHandler(authenticate),
  validateParams(UserParamsSchema),
  asyncHandler(followController.follow),
);

router.delete(
  "/users/:id/follow",
  asyncHandler(authenticate),
  validateParams(UserParamsSchema),
  asyncHandler(followController.unfollow),
);

export default router;
