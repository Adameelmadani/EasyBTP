import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, "_").slice(0, 40);
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 Mo
});

export { uploadDir };
