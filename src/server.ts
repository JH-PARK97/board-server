import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import PostRouter from './routes/post.route';
// import cors from 'cors';
var cors = require('cors');

export const prisma = new PrismaClient();

const app = express();
const port = 8080;

async function main() {
    app.use(express.json());
    app.use(cors());

    app.use('/api/v1/post', PostRouter);

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
