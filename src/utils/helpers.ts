import * as jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.SECRET;
const JWT_SECRET = 'secret';
const EXPIRES_IN = 3600 * 24;

export type dataType = {
    userId: number;
    email: string;
};

export function generateJwt(data: dataType): string {
    return jwt.sign(data, JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: EXPIRES_IN,
    });
}

export function decodeJwt(token: string): dataType | string {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'string') return decoded;
    const { userId, email } = decoded as dataType;
    return { userId, email };
}
