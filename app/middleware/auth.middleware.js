import express  from "express" ; 
import * as jwt from "jsonwebtoken" ; 
import dotenv from 'dotenv' ; 
dotenv.config()

export const userMiddleware = (req ,  res , next) =>{
    const header = req.headers["authorization"] ; 
    const decoded  = jwt.verify(`${header}`,` ${process.env.JWT_USER_SECRET}`)

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