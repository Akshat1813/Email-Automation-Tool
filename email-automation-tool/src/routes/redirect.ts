import express from 'express'
import {getGmailAuthUrl,getGmailToken,fetchGmailMessages} from '../auth/gmailAuth'
const redirect = express.Router();

 
redirect.get('/authenticate', async (req, res) => {
    const authenurl = await getGmailAuthUrl();
    res.redirect(authenurl);
})


redirect.get('/redirect', async (req, res) => {
    const code = req.query.code as string;

    if (!code) {
        res.status(400).send('Authorization code not provided');
    }

    const restok = await getGmailToken(code);
    res.json(restok);
})

export {redirect}