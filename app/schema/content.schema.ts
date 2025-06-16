import mongoose from 'mongoose' ; 
const contentTypes = ["image" , "video" , "article", "audio"]  
const contentSchema = new mongoose.Schema({ 
    link : {
        type : String,  
        required : true 
    }, 
    type : {
        type : String , 
        enum : contentTypes , 
        required : true 
    }, 
    title : {
        type : String , 
        required : true  
    }, 
    tag : {
        type : mongoose.Types.ObjectId , 
        ref : "tags"
    }, 
    userId : { 
        type : mongoose.Types.ObjectId , 
        ref : "user" , 
        required : true ,
    }
}) ; 

export const contentModel = mongoose.model("content" , contentSchema) ; 