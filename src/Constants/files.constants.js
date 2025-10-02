export const fileTypes = {
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  DOCUMENT: "document",
  OTHER: "other",
};

export const allowedFileExtensions = {
  [fileTypes.IMAGE]: ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "svg"],
  [fileTypes.VIDEO]: ["mp4", "avi", "mov", "wmv", "flv", "mkv"],
  [fileTypes.AUDIO]: ["mp3", "wav", "aac", "flac", "ogg"],
  [fileTypes.DOCUMENT]: [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
  ],
  [fileTypes.OTHER]: [".zip", ".rar", ".7z", ".tar", ".gz"],
};
