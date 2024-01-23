import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import Router from './routes/route';
import cookieParser from 'cookie-parser';
var cors = require('cors');

export const prisma = new PrismaClient();

const app = express();
const port = 8080;
const jwtSecretKey = process.env.TOKEN_SECRET_KEY as string;

async function main() {
    app.use(express.json());
    app.use(cors());
    app.use(cookieParser(jwtSecretKey));

    app.use('/api/v1', Router);

    app.all('*', (req: Request, res: Response) => {
        res.status(404).json({ error: `Route ${req.originalUrl} not found` });
    });

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}

main()
    .then(async () => {
        await prisma.$connect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
