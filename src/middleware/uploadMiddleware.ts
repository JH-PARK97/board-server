import util from 'util';
import multer from 'multer';
const MAX_SIZE = 2 * 1024 * 1024;

let storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, __dirname + '/resources/static/assets/uploads');
    },
    filename(req, file, callback) {
        console.log(file.originalname);
        callback(null, file.originalname);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: MAX_SIZE },
}).single('file');

let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;
