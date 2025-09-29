import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authorize(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    console.log(header)
    if (!header) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const parts = header.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ message: 'Invalid auth format' });
    }

    const [scheme, token] = parts;
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Invalid auth format' });
    }

    try {
        const secret = process.env.JWT_Secret;
        if (!secret) {
            return res.status(500).json({ message: 'Server misconfigured: missing JWT_Secret' });
        }
        const payload = jwt.verify(token, secret);
        (req as any).user = payload;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}