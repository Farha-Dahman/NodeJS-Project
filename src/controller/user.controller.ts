import { Request, Response } from "express";

export const profile = async (req: Request, res: Response) => {
    const user = (req as any).user;
    return res.json(user);
}
