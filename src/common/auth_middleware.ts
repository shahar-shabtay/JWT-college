import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
    user: { _id: string };
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { _id: string };
        req.user = decoded; // Attach user info to req
        next();
    } catch (error) {
        return res.status(403).json({ error: error.message });
    }

}

export default authMiddleware;