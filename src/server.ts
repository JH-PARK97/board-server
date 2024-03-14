import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import Router from './routes/route';
import axios from 'axios';
import jwt from 'jsonwebtoken';

var cors = require('cors');

export const prisma = new PrismaClient();

const app = express();
const port = 8080;

const githubConfig = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    redirectUri: process.env.GITHUB_REDIRECT_URI,
};

const { clientId, clientSecret, redirectUri } = githubConfig;

async function main() {
    app.use(express.json());
    app.use(cors());
    app.use(express.static('public'));
    app.use(express.urlencoded({ extended: false }));

    app.get('/callback/github', async (req, res) => {
        try {
            const { code } = req.query;
            const { data: tokenResponse } = await axios.post(
                'https://github.com/login/oauth/access_token',
                {
                    client_id: clientId,
                    client_secret: clientSecret,
                    code,
                    redirect_uri: redirectUri,
                },
                {
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );
            const { access_token } = tokenResponse;

            const userData = await axios.get('http://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            try {
                const jwtSecretKey = process.env.TOKEN_SECRET_KEY as string;
                const email = userData.data.email;
                const user = await prisma.user.findUnique({ where: { email } });
                console.log(user);
                if (!user) {
                    return res.status(401).json({ error: { resultCd: 401, resultMsg: '존재하지 않는 계정입니다.' } });
                }
                const token = jwt.sign({ email: user.email, age: user.age, gender: user.gender }, jwtSecretKey, {
                    expiresIn: '1h',
                });

                return res.status(201).json({ resultCd: 200, data: user, token });
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            res.status(500).json({ message: 'Failed to authenticate' });
        }
    });

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
