import { Request, Response , NextFunction } from "express" ; 
import * as jwt from "jsonwebtoken"
require("dotenv").config()  ; 

export const userMiddleware = (req : Request,  res : Response, next : NextFunction ) =>{
    const header = req.headers["authorization"] ; 
    const decoded  = jwt.verify(header as string,` ${process.env.JWT_USER_SECRET}`)

    if(decoded) { 
        //@ts-ignore 
        req.userId = decoded.id  ;  
        next()
    }
    else { 
        res.status(403).json({
            message :"You are not logged in!"
        })
    }
}