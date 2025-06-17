import mongoose from 'mongoose' ;

const userSchema = new mongoose.Schema({
    username : {
        required : true,  
        type : String  , 
        unique : true , 
    }, 
    password : { 
        required : true , 
        type : String , 
    }
})

export const userModel = mongoose.model("user", userSchema) ; 