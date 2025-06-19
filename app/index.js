import express from "express" ; 
import   bcrypt from 'bcrypt' ; 
import  jwt from "jsonwebtoken" 
import * as mongoose from 'mongoose' 
import * as zod from 'zod' ; 
import { userModel } from "./schema/user.schema.js" ; 
import { contentModel } from "./schema/content.schema.js"; 
import { linkModel  } from "./schema/links.schema.js"; 
import { tagsModel } from "./schema/tags.schema.js"
import connectDB from "./db.js"
import { userMiddleware } from "./middleware/auth.middleware.js";
import signUpZodSchema from "./zod_schema/signUp.zod.js";
import randomString  from "./utils.js"  
import dotenv from 'dotenv' ; 
dotenv.config("") ; 
const app = express() ; 
app.use(express.json()) ; 



app.get("/" , (req, res)=>{ 
    res.send("hello world !")
})

app.post("/api/v1/signin", async (req , res)=>{
     
    try { 
        const validateInputData = signUpZodSchema.parse(req.body) ; 
        const { username , password } = validateInputData ; 
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
                message : "Sign in successful"  , 
                token : token , 
            })
        }else { 
            res.json({
                message : "Incorrect credentials" ,
            }).status(403)
        }
    }catch(e) { 
        if (e instanceof zod.ZodError)  { 
            res.json({
                message : e.message ,
            })
        }
        console.log("Error occurred while finding the user") ; 
        res.json({
            message : "Error occurred while finding the user" 
        }).status(501)  ; 
    }

} )

app.post("/api/v1/signup", async  (req , res )=>{
    try {
        const validateInputData = signUpZodSchema.parse(req.body); 
        const { username , password } = validateInputData ; 
        
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
        if (e instanceof zod.ZodError)  { 
            res.json({
                message : e.message.message ,
            })
        }
        res.json({
            message : `Error occurred while creating user `
        }).status(501) ;  
        console.log(e)
    }
}) 

app.post("/api/v1/content" , userMiddleware, async  (req , res)=>{
    const { link , title , type, userId, tag } = req.body ;  

    try {
        await contentModel.create({
            link : link , 
            title : title , 
            type : type , 
            tag : tag, 
            userId : userId 
        }) 
        res.json({
            message : "Content created succesfully ! "
        }).status(201)   

    }
    catch(e) { 
        console.log("Error occurred while creating content " + e) 
        res.json({
            message: "error while creating content"
        }).status(501) ; 
    }
})


app.get("/api/v1/content" , userMiddleware,  async (req , res )=>{
    try {
        const { userId } = req.body  

        const content  =  contentModel.find({
            userId : userId
        }).populate("userId", "username") ; 
        res.json({
            content : content 
        }).status(201)
    }catch(e) { 
        console.log("error while fetchign content ") ; 
        res.json({
            message : 'error while fetching content'
        }).status(503)
    }
})

app.delete("/api/v1/content" ,userMiddleware, async  (req , res )=>{
    const contentId = req.body.contentId ; 
    const userId = req.body.userId  ; 

    await contentModel.deleteMany({
        contentId : contentId   , 
        userId : userId  
    }) 


    res.json({
        message : "Content deleted"
    })
    
})

app.post("/api/v1/brain/share" , userMiddleware ,async (req ,res )=>{
    const share = req.body.share  ; 
    if(share) { 
        const existingLink = await linkModel.findOne({
            userId : req.userId , 
        })

        if(existingLink ) { 
            res.json({
                hash : existingLink.hash , 
            }) 
            return ; 
        }
        const hash = randomString(10)
        await linkModel.create({
            userId : req.body.userId  , 
            hash : hash
        })

        res.json({
            hash : hash 
        })
    }else { 
        await linkModel.deleteOne({
            userId : req.userId 
        })
    }
})  

app.get("/api/v1/brain/:shareLink" , userMiddleware,   async (req , res)=>{
    const hash = req.params.shareLink ; 
    
    const link = await linkModel.findOne({
        hash
    }); 
    
    if(!link) { 
        res.status(411).json({
            message : "Incorrect input"
        }) ; 
        return ; 
    }
  
    const content = await contentModel.find({
        userId : link.userId
    })
    
    const user = await userModel.findOne({
        _id : link.userId  
    })

    if(!user) { 
        res.status(411).json({
            message : "user not found"   
        })
    }

    res.json({
        username : user?.username , 
        content : content 
    })
    
})
app.post('/api/v1/addTag', userMiddleware, async (req, res)=>{
    const {tagName,  tagDescription} = req.body  ; 

    try { 
        await tagsModel.create({
            tagName : tagName  , 
            tagDescription : tagDescription 
        })

        console.log("Tag added successfully!") 
        res.json({
            message : `tag ${tagName} added succesfully` 
        }).status(201)
    }catch(e) { 
        console.log("Error while creating the tag : \n" + e) ; 
        res.json({
            message : `Error while creating the tag`
        }).status(501) 
    }
})

app.listen(3000, ()=>{
    console.log("server started") 
    connectDB()
}) 