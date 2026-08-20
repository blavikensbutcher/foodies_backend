import { z } from "zod";

export const RecipeIngredientSchema = z.object({
  id: z.string().trim().min(1, "Ingredient id is required"),
  measure: z.string().trim().min(1, "Measure is required"),
});

const parseIngredients = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }

  if (value.trim() === "") {
    return undefined;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const recipeIngredientsSchema = z.preprocess(
  parseIngredients,
  z
    .array(RecipeIngredientSchema)
    .min(1, "At least one ingredient is required")
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === items.length,
      {
        message: "Duplicate ingredients found. Please check your list.",
      },
    ),
);

const recipeBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must contain at least 3 characters")
    .max(64, "Title must contain at most 64 characters"),
  instructions: z
    .string()
    .trim()
    .min(10, "Instructions must contain at least 10 characters")
    .max(1000, "Instructions must contain at most 1000 characters"),
  description: z
    .string()
    .trim()
    .max(200, "Description must contain at most 200 characters")
    .optional(),
  time: z.string().trim().optional(),
  categoryId: z.string().trim().min(1, "Category is required"),
  areaId: z.string().trim().min(1, "Area is required"),
  ingredients: recipeIngredientsSchema,
});

export const CreateRecipeSchema = recipeBodySchema;

/** Multipart/Swagger sends "" for untouched fields — treat as "not provided". */
const omitEmptyStrings = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, fieldValue]) => [
      key,
      typeof fieldValue === "string" && fieldValue.trim() === ""
        ? undefined
        : fieldValue,
    ]),
  );
};

const hasProvidedValue = (value: unknown) =>
  value !== undefined && !(typeof value === "string" && value.trim() === "");

export const UpdateRecipeSchema = z.preprocess(
  omitEmptyStrings,
  recipeBodySchema.partial(),
);

export const RecipeParamsSchema = z.object({
  id: z.string().trim().min(1, "Recipe id is required"),
});

export type CreateRecipeBody = z.infer<typeof CreateRecipeSchema>;
export type UpdateRecipeBody = z.infer<typeof UpdateRecipeSchema>;
export type RecipeParams = z.infer<typeof RecipeParamsSchema>;

export function hasRecipeUpdatePayload(
  body: Record<string, unknown>,
  hasFile: boolean,
): boolean {
  if (hasFile) {
    return true;
  }

  return (
    hasProvidedValue(body.title) ||
    hasProvidedValue(body.instructions) ||
    hasProvidedValue(body.description) ||
    hasProvidedValue(body.time) ||
    hasProvidedValue(body.categoryId) ||
    hasProvidedValue(body.areaId) ||
    hasProvidedValue(body.ingredients)
  );
}
