import swaggerJsdoc from "swagger-jsdoc";

import { DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from "../utils/pagination";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Foodies API",
      version: "1.0.0",
      description: "API documentation for the Foodies backend",
    },
    servers: [
      {
        url: "/api",
      },
    ],
    components: {
      schemas: {
        RecipePreview: {
          type: "object",
          required: ["id", "title", "mainImage"],
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            mainImage: { type: "string", nullable: true },
          },
        },
        UserCard: {
          type: "object",
          required: [
            "id",
            "name",
            "avatar",
            "email",
            "recipesCount",
            "favoritesCount",
            "followersCount",
            "followingCount",
            "isFollowing",
            "recipes",
          ],
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            avatar: { type: "string", nullable: true },
            email: { type: "string" },
            recipesCount: { type: "integer" },
            favoritesCount: { type: "integer" },
            followersCount: { type: "integer" },
            followingCount: { type: "integer" },
            isFollowing: {
              type: "boolean",
              description: "Whether the authenticated user follows this user",
            },
            recipes: {
              type: "array",
              description: "Up to 4 latest recipes used as a preview",
              items: { $ref: "#/components/schemas/RecipePreview" },
            },
          },
        },
        UserListPage: {
          type: "object",
          required: ["users", "total", "page", "limit", "totalPages"],
          properties: {
            users: {
              type: "array",
              items: { $ref: "#/components/schemas/UserCard" },
            },
            total: { type: "integer" },
            page: { type: "integer" },
            limit: { type: "integer" },
            totalPages: { type: "integer" },
          },
        },
      },
      parameters: {
        PageParam: {
          in: "query",
          name: "page",
          schema: { type: "integer", minimum: 1, default: 1 },
        },
        LimitParam: {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            minimum: 1,
            maximum: MAX_PAGE_LIMIT,
            default: DEFAULT_PAGE_LIMIT,
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);