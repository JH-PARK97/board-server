import { Request, Response } from 'express';
import uploadFile from '../../middleware/uploadMiddleware';
import fs from 'fs';

const directoryPath = 'uploads/';

const upload = async (req: Request, res: Response) => {
    try {
        await uploadFile(req, res);
        if (req.file === undefined) {
            return res.status(400).send({ resultCd: 400, resultMsg: '파일을 업로드해 주세요.' });
        }
        res.status(200).send({ resultCd: 200, resultMsg: `파일 업로드 : ${req.file.originalname}` });
    } catch (error) {
        res.status(500).send({
            resultCd: 500,
            resultMsg: `Could not upload the file. ${error}`,
        });
    }
};

const getImage = (req: Request, res: Response) => {
    const imageName = req.params.imageName;
    const readStream = fs.createReadStream(`images/${imageName}`);
    readStream.pipe(res);
};

const download = (req: Request, res: Response) => {
    const fileName = req.params.name;

    res.download(directoryPath + fileName, fileName, (error) => {
        if (error) {
            if (!req.file) return null;
            res.status(500).send({
                resultCd: 500,
                resultMsg: `Could not upload the file: ${req.file.originalname}. ${error}`,
            });
        }
    });
};

export default { upload, getImage, download };
