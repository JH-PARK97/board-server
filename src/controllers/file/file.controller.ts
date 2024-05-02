import express, { Request, Response } from 'express';
import { profileMiddleware, uploadFileMiddleware } from '../../middleware/uploadMiddleware';
import fs from 'fs';
import path from 'path';

const directoryPath = 'uploads/';

const upload = async (req: Request, res: Response) => {
    try {
        const { path } = req.query;
        if (path === 'posts') {
            await uploadFileMiddleware(req, res);
        } else if (path === 'profile') {
            await profileMiddleware(req, res);
        }

        if (!req.file) return null;
        const file = req.file;
        if (req.file === undefined) {
            return res.status(400).send({ resultCd: 400, resultMsg: '파일을 업로드해 주세요.' });
        }
        res.status(200).send({ resultCd: 200, file });
    } catch (error) {
        res.status(500).send({
            resultCd: 500,
            resultMsg: `Could not upload the file. ${error}`,
        });
    }
};

const getImage = (req: Request, res: Response) => {
    const filename = req.params.filename;
    const imgPath = req.query.path;

    if (!path) return res.status(400).send({ resultCd: 400, resultMsg: 'path query를 입력해 주세요.' });

    res.sendFile(path.join(__dirname, `../../../public/${imgPath}/${filename}`));
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
