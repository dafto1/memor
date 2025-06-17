import mongoose from 'mongoose' ; 

const linkSchema = new mongoose.Schema({
    hash : {
        type : String , 
        required : true 
    }, 
    //relationship between user schema and links schema 
    userId : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'User' , 
        required : true 
    }
})