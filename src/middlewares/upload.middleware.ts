import type { RequestHandler } from "express";
import multer from "multer";

import {
  ALLOWED_UPLOAD_MIME_TYPES,
  AVATAR_UPLOAD_FIELD_NAME,
  MAX_UPLOAD_FILE_SIZE_BYTES,
  UPLOAD_FIELD_NAME,
  UPLOADS_DIR,
} from "../constants/uploads";

const imageUpload = multer({
  dest: UPLOADS_DIR,
  limits: { fileSize: MAX_UPLOAD_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_UPLOAD_MIME_TYPES.includes(file.mimetype as typeof ALLOWED_UPLOAD_MIME_TYPES[number])) {
      cb(null, true);
      return;
    }

    cb(new Error("Only image files are allowed"));
  },
});

const uploadSingleImage = (fieldName: string): RequestHandler => (req, res, next) => {
  imageUpload.single(fieldName)(req, res, (error) => {
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    next();
  });
};

export const uploadRecipeImage = uploadSingleImage(UPLOAD_FIELD_NAME);

export const uploadAvatarImage = uploadSingleImage(AVATAR_UPLOAD_FIELD_NAME);
