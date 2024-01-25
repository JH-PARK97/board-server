import { Request, Response } from "express";

const uploadFile = require("../../middleware/uploadMiddleware")

const upload = async (req:Request, res:Response) => {
    try {
        await uploadFile(req,res);

        if (req.file === undefined){
            return res.
        }

    }
    
}