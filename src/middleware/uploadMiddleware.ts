import util from 'util';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const MAX_SIZE = 2 * 1024 * 1024;

const postStorage = multer.diskStorage({
    destination(req, file, callback) {
        const uploadPath = 'public/posts/';

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        callback(null, uploadPath);
    },

    filename(req, file, callback) {
        const filename = Buffer.from(file.originalname, 'latin1').toString('utf-8');
        callback(null, `${filename}-${Date.now() + path.extname(filename)}`);
    },
});

const profileStorage = multer.diskStorage({
    destination(req, file, callback) {
        const uploadPath = 'public/profile/';

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        callback(null, uploadPath);
    },

    filename(req, file, callback) {
        const filename = Buffer.from(file.originalname, 'latin1').toString('utf-8');
        callback(null, `${filename}-${Date.now() + path.extname(filename)}`);
    },
});
const uploadFile = multer({
    storage : postStorage,
    limits: { fileSize: MAX_SIZE },
}).single('posts');

const profileImage = multer({
    storage : profileStorage,
    limits: { fileSize: MAX_SIZE },
}).single('profile');

const uploadFileMiddleware = util.promisify(uploadFile);

const profileMiddleware = util.promisify(profileImage);

export { uploadFileMiddleware, profileMiddleware };
