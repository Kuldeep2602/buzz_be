import{ NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {JWT_PASSWORD} from "./config"

export const userMiddleware = (req: Request, res: Response,
    next: NextFunction) => {
        const header = req.headers["authorization"];   
        const decoded = jwt.verify(header as string , JWT_PASSWORD);
        if(decoded){
            //@ts-ignore
            // req.userId = decoded.indexOf;
            req.userId = decoded.id;
            //@ts-ignore
            console.log("User ID set in request:", req.userId);
            next();
        }else{
            res.status(403).json({
                message:"You are not logged in"
            })
        }
}

