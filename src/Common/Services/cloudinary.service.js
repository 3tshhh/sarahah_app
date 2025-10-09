import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFileCloudinary = async (file, options) => {
  const result = await cloudinary.uploader.upload(file, options);
  return result;
};

export const uploadMultipleFilesCloudinary = async (files, options) => {
  const result = [];
  for (const file of files) {
    const { secure_url, public_id } = await uploadFileCloudinary(file, options);
    result.push({ secure_url, public_id });
  }
  return result;
};

export const DeleteFileCloudinary = async (public_id) => {
  const result = await cloudinary.uploader.destroy(public_id);
  return result;
};

export const DeleteManyCloudinary = async (public_ids, options) => {
  const result = await cloudinary.api.delete_resources(public_ids, options);
  return result;
};


export const cleanupFolderCloudinary = async (folderPath, options) => {
  const result = await cloudinary.api.delete_resources_by_prefix(folderPath, options);
  return result;
}


export const DeleteFolderCloudinary = async (folderPath, options) => {
    await cleanupFolderCloudinary(folderPath);
    const result = await cloudinary.api.delete_folder(folderPath, options);
    return result;
}