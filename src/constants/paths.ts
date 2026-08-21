export const APP_PATHS = {
  RECIPES: "/recipes",
} as const;

export const RECIPE_PATHS = {
  ROOT: "",
  OWN: "/own",
  FAVORITES: "/favorites",
  BY_USER: "/user/:id",
  BY_ID: "/:id",
  FAVORITE_BY_ID: "/:recipeId/favorite",
} as const;

export const RECIPE_OPENAPI_PATHS = {
  ROOT: APP_PATHS.RECIPES,
  OWN: `${APP_PATHS.RECIPES}/own`,
  FAVORITES: `${APP_PATHS.RECIPES}/favorites`,
  BY_USER: `${APP_PATHS.RECIPES}/user/{id}`,
  BY_ID: `${APP_PATHS.RECIPES}/{id}`,
  FAVORITE_BY_ID: `${APP_PATHS.RECIPES}/{recipeId}/favorite`,
} as const;
