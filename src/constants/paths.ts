export const APP_PATHS = {
  RECIPES: "/recipes",
} as const;

export const RECIPE_PATHS = {
  ROOT: "",
  OWN: "/own",
  BY_ID: "/:id",
} as const;

export const RECIPE_OPENAPI_PATHS = {
  ROOT: APP_PATHS.RECIPES,
  OWN: `${APP_PATHS.RECIPES}/own`,
  BY_ID: `${APP_PATHS.RECIPES}/{id}`,
} as const;
