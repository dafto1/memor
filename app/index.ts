import * as express from "express" ; 
import * as  bcrypt from 'bcrypt' ; 
import * as jwt from "jsonwebtoken" 
import  { userModel } from "./schema/user.schema.js" ; 
import { contentModel } from "./schema/content.schema";
import connectDB from "./db"
import { userMiddleware } from "./middleware/auth.middleware.js";
import * as mongoose from 'mongoose' 
import * as dotenv from "dotenv";
dotenv.config();

const app = express() ; 
app.use(express.json()) ; 

connectDB() ; 

app.get("/" , (req, res)=>{ 
    res.send("hello world !")
})

app.post("/api/v1/signin",   async (req,res)=>{
    const { password, username } = req.body ; 
    try { 

        const existingUser = await userModel.findOne({
            username 
        }) ; 
        
        if(existingUser) { 
            const isPasswordValid = bcrypt.compare(password , existingUser.password) ; 

            if(!isPasswordValid) { 
                res.json({
                    message : "Incorrect Password Entered! Please try again ! "
                }).status(501) ; 
            }

            const token = jwt.sign({
                id : existingUser._id, 
            }, `${process.env.JWT_TOKEN_SECRET}`) ; 
            
            res.json({
                token : token , 
            })
        }else { 
            res.json({
                message : "Incorrect credentials" ,
            }).status(403)
        }
    }catch(e) { 
        console.log("Error occurred while finding the user") ; 
        res.json({
            message : "Error occurred while finding the user" 
        }).status(501)  ; 
    }

} )

app.post("/api/v1/signup", async  (req, res)=>{
    const { username } = req.body ; 
    const { password } = req.body ; 
  

    try { 
        const hashedPassword = await bcrypt.hash(password , 10) ; 
        await userModel.create({
            username : username , 
            password : hashedPassword  , 
        })

        res.json({
            message : `user ${username} created succssfully !` ,
            status : 201 ,  
        }).status(201) 
        console.log("user created successfully ! ") ; 
    } 
    catch(e) { 
        res.json({
            message : `Error occurred while creating user `
        }).status(501) ;  
        console.log(e)
    }
}) 

app.post("/api/v1/content" , userMiddleware,async  (req, res)=>{
    const { link , title , type, tag , userId } = req.body ;  

    try {
        await contentModel.create({
            link : link , 
            title : title , 
            type : type , 
            tag : tag , 
            userId : userId 
        }) 
        res.json({
            message : "Content created succesfully ! "
        }).status(201)   

    }
    catch(e) { 
        console.log("Error occurred while creating content ") 
        res.json({
            message: "error while creating content"
        }).status(501) ; 
    }
})


app.get("/api/v1/content" , (req, res)=>{

})

app.delete("/api/v1/content" , (req, res)=>{

})

app.post("/api/v1/brain/share" , (req ,res)=>{

})

app.get("/api/v1/brain/:shareLink" , (req, res)=>{

})


app.listen(3000, ()=>{
    console.log("server started")
}) 