import { Request, Response } from 'express';

async function pingController(req: Request, res: Response) {
    res.send('pong');
}

export { pingController };