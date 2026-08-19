import { unlink } from "node:fs/promises";

import { cloudinary } from "../config/cloudinary";

const extractPublicId = (url: string) => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);

  return match?.[1] ?? null;
};

export const removeTempUploadedFile = async (
  file?: Express.Multer.File,
): Promise<void> => {
  if (!file?.path) {
    return;
  }

  await unlink(file.path).catch(() => undefined);
};

export const uploadFile = async (
  file: Express.Multer.File,
  folder: string,
): Promise<string> => {
  if (file.path) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: "image",
      });

      return result.secure_url;
    } finally {
      await removeTempUploadedFile(file);
    }
  }

  if (!file.buffer) {
    throw new Error("Uploaded file is missing");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Failed to upload file"));
          return;
        }

        resolve(result.secure_url);
      },
    );

    stream.end(file.buffer);
  });
};

export const deleteFile = async (url: string): Promise<void> => {
  const publicId = extractPublicId(url);

  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};
