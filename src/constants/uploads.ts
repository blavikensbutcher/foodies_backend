export const UPLOADS_DIR = "uploads/";
export const CLOUDINARY_RECIPES_FOLDER = "foodies/recipes";
export const CLOUDINARY_AVATARS_FOLDER = "foodies/avatars";
export const UPLOAD_FIELD_NAME = "mainImage";
export const AVATAR_UPLOAD_FIELD_NAME = "avatar";
export const MAX_UPLOAD_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
