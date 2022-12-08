import { Request } from 'express';

function getCreds(req: Request) {
    const token = req.headers.authorization;
    if (token) {
        const creds = Buffer.from(token.split(" ")[1], 'base64').toString('utf8');
        const email = creds.split(":")[0];
        const password = creds.split(":")[1];
        return { email, password };
    } else {
        return null;
    }
}

export {
    getCreds,
}