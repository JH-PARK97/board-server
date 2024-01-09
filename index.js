const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Prisma, PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const port = 8080;

const githubConfig = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    redirectUri: process.env.GITHUB_REDIRECT_URI,
};

const { clientId, clientSecret, redirectUri } = githubConfig;

app.get('/welcome', (req, res) => {
    res.send('Hello World!');
});

app.get('/oauth/github/callback', async (req, res) => {
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
        // console.log()
    } catch (error) {
        res.status(500).json({ message: 'Failed to authenticate' });
    }
});

app.get('/users', async (req, res) => {
    const users = await prisma;
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
