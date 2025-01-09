import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

//recrate the path.__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadPath = path.join(__dirname, '../../public/temp');
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },

  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname); // Get file extension
    const baseName = path.basename(file.originalname, fileExtension); // Get filename without extension
    cb(null, `${baseName}-${timestamp}${fileExtension}`);
  },
});

// Initialize multer with the configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10, // Limit file size to 10 MB
    },
});

export default upload;

