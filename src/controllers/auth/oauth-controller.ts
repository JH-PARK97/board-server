import axios from 'axios';
import { Request, Response } from 'express';
import { prisma } from '../../server';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../../constants';

const githubConfig = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    redirectUri: process.env.GITHUB_REDIRECT_URI,
};

const { clientId, clientSecret, redirectUri } = githubConfig;

export default async function githubCallback(req: Request, res: Response) {
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

        const email = userData.data.email;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(200).json({
                resultCd: 401,
                resultMsg: '존재하지 않는 계정입니다.',
                email: userData.data.email,
            });
        }
        const token = jwt.sign({ email: user.email, age: user.age, gender: user.gender, id: user.id }, JWT_SECRET_KEY, {
            expiresIn: '1d',
        });

        res.status(201).json({ resultCd: 200, data: user, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: '/callback/github' });
    }
}
