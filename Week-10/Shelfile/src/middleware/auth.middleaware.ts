import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/type";

const authMiddleware =( 
    req:Request,
    res:Response,
    next:NextFunction
)=>{



    try {


        const authHeader = req.headers.authorization;

        if(!authHeader){

            return res.status(401).json({
                message: "No token provided",
              });
        }


        const token = authHeader.split("")[1]

        if(!token){

            return res.status(401).json({
                message: "Invalid authorization header",
              });
        }


        const decode = jwt.verify(
            token,
            process.env.JWT_SECERT!
        ) as JwtPayload

        console.log(decode.userId)

        next()
        
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
          });

        
    }
}

export default authMiddleware