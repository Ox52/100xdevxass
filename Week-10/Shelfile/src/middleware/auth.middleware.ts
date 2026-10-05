    import type { Request, Response, NextFunction } from "express";
    import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/type";

const authMiddleware = (
    req:Request,
    res:Response,
    next:NextFunction
) =>{

    try {

        const authHeader = req.headers.authorization;

        if(!authHeader){

            return res.status(401).json({
                message: "No token provided",
              });
        }

        const [scheme, token] = authHeader.split(" ")

        if(scheme !== "Bearer" || !token){

            return res.status(401).json({
                message: "Invalid authorization header",
              });
        }

        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload

        req.user = decode

        next()

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
          });
    }
}

export default authMiddleware
