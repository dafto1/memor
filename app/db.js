import * as  mongoose from 'mongoose' ; 
import * as express from 'express';
import dotenv from 'dotenv' 
dotenv.config() ; 


const connectDB =  async  ()=>{
    try { 
        const dbConnection = await mongoose.connect(`${process.env.MONGO_DB_URL}`) 
        console.log("successfully connected to mongo db cluster ! ") ; 
    }
    catch(e) { 
        console.log(`Error occured while connecting mongo db cluster ! ${e.message}`); 
    }
}
export default connectDB ; 