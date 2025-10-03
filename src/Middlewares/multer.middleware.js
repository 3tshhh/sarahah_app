import multer from "multer";
import fs from "fs";
import { allowedFileExtensions, fileTypes } from "../Constants/index.js";

// Ensure upload directories exist
const checkOrCreateFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};
export const localUpload = ({ folderPath = "samples" }) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = `uploads/${folderPath}`;
      checkOrCreateFolder(folder);
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    let [fileKey, fileExtension] = file.mimetype.split("/")
    const fileType = fileTypes[fileKey.toUpperCase()];
    
    if (!fileType) return cb(new Error("Unsupported file type"), false);
    
    if(!allowedFileExtensions[fileKey.toLowerCase()].includes(fileExtension)) return cb(new Error("Unsupported file extension"), false);
    return cb(null, true);
  }
  return multer({
    fileFilter,
    storage,
  });
};


export const hostUpload = () => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    let [fileKey, fileExtension] = file.mimetype.split("/")
    const fileType = fileTypes[fileKey.toUpperCase()];
    
    if (!fileType) return cb(new Error("Unsupported file type"), false);
    
    if(!allowedFileExtensions[fileKey.toLowerCase()].includes(fileExtension)) return cb(new Error("Unsupported file extension"), false);
    return cb(null, true);
  }
  return multer({
    fileFilter,
    storage,
  });
};
