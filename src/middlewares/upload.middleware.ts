import type { RequestHandler } from "express";
import multer from "multer";

import { MAX_UPLOAD_FILE_SIZE_BYTES, UPLOAD_FIELD_NAME, UPLOADS_DIR } from "../constants/uploads";

const recipeImageUpload = multer({
  dest: UPLOADS_DIR,
  limits: { fileSize: MAX_UPLOAD_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
      return;
    }

    cb(new Error("Only image files are allowed"));
  },
});

export const uploadRecipeImage: RequestHandler = (req, res, next) => {
  recipeImageUpload.single(UPLOAD_FIELD_NAME)(req, res, (error) => {
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    next();
  });
};
