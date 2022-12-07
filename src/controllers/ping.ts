import { Request, Response } from 'express';

async function pingController(req: Request, res: Response) {
    res.status(200).send('pong');
}

export { pingController };