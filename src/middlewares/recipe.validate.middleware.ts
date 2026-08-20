import type { RequestHandler } from "express";

import { hasRecipeUpdatePayload, UpdateRecipeSchema } from "../utils/recipe.validation";
import { removeTempUploadedFile } from "../services/upload.service";
import { validateBody } from "./validate.middleware";

export const validateUpdateRecipeBody: RequestHandler = (req, res, next) => {
  if (!hasRecipeUpdatePayload(req.body as Record<string, unknown>, Boolean(req.file))) {
    void removeTempUploadedFile(req.file);

    return res.status(422).json({
      error: "Validation failed",
      details: {
        _form: ["At least one field must be provided for update"],
      },
    });
  }

  return validateBody(UpdateRecipeSchema)(req, res, next);
};
