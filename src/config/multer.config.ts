import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'samples', // Specify the folder in Cloudinary
    format: 'png', // Specify the format (e.g., 'jpg', 'png', etc.)
    public_id: file.originalname, // Set the public ID to the original file name
  }),
});

export default storage;
