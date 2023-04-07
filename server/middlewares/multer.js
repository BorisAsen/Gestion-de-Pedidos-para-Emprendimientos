import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/ImgProducts'))
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname.split('.')[0]}.${file.mimetype.split('/')[1]}`)
    }
});