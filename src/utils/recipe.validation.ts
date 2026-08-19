import { z } from "zod";

export const RecipeIngredientSchema = z.object({
  id: z.string().trim().min(1, "Ingredient id is required"),
  measure: z.string().trim().min(1, "Measure is required"),
});

const parseIngredients = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
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

export const UpdateRecipeSchema = recipeBodySchema
  .partial()
  .refine(
    (data) =>
      data.title !== undefined ||
      data.instructions !== undefined ||
      data.description !== undefined ||
      data.time !== undefined ||
      data.categoryId !== undefined ||
      data.areaId !== undefined ||
      data.ingredients !== undefined,
    { message: "At least one field must be provided for update" },
  );

export const RecipeParamsSchema = z.object({
  id: z.string().trim().min(1, "Recipe id is required"),
});

export type CreateRecipeBody = z.infer<typeof CreateRecipeSchema>;
export type UpdateRecipeBody = z.infer<typeof UpdateRecipeSchema>;
export type RecipeParams = z.infer<typeof RecipeParamsSchema>;

export function hasRecipeUpdatePayload(body: Record<string, unknown>, hasFile: boolean): boolean {
  if (hasFile) {
    return true;
  }

  return (
    body.title !== undefined ||
    body.instructions !== undefined ||
    body.description !== undefined ||
    body.time !== undefined ||
    body.categoryId !== undefined ||
    body.areaId !== undefined ||
    body.ingredients !== undefined
  );
}
