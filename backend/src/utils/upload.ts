import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads" as any, // Explicitly cast to avoid TypeScript error
    format: async () => "png",
    public_id: (req: any, file: any) => file.originalname.split(".")[0],
  } as any, // Cast the entire params object to any
});

const upload = multer({ storage });

export default upload;
