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
    .max(100, "Title must contain at most 100 characters"),
  instructions: z
    .string()
    .trim()
    .min(10, "Instructions must contain at least 10 characters")
    .max(1000, "Instructions must contain at most 1000 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(200, "Description must contain at most 200 characters"),
  time: z
    .string()
    .trim()
    .min(1, "Cooking time is required")
    .regex(/^\d+$/, "Cooking time must be a whole number"),
  categoryId: z.string().trim().min(1, "Category is required"),
  areaId: z.string().trim().min(1, "Area is required"),
  ingredients: recipeIngredientsSchema,
});

export const CreateRecipeSchema = recipeBodySchema;

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
