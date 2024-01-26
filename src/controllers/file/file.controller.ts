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

const getListFiles = (req: Request, res: Response) => {
    fs.readdir(directoryPath, function (error, files) {
        if (error) {
            if (!req.file) return null;
            res.status(500).send({
                resultCd: 500,
                resultMsg: `Could not upload the file: ${req.file.originalname}. ${error}`,
            });
        }
        let fileInfos: { name: string; url: string }[] = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: directoryPath,
            });
        });
        res.status(200).send(fileInfos);
    });
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

export default { upload, getListFiles, download };
