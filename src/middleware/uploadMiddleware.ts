import util from 'util';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const MAX_SIZE = 2 * 1024 * 1024;

const storage = multer.diskStorage({
    destination(req, file, callback) {
        const uploadPath = 'uploads/';

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        callback(null, uploadPath);
    },

    filename(req, file, callback) {
        callback(null, `${file.originalname}-${Date.now() + path.extname(file.originalname)}`);
    },
});

const uploadFile = multer({
    storage: storage,
    limits: { fileSize: MAX_SIZE },
}).single('file');

const uploadFileMiddleware = util.promisify(uploadFile);

export default uploadFileMiddleware;
