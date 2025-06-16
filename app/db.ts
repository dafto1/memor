import * as  mongoose from 'mongoose' ; 
import * as express from 'express';
require('dotenv').config(); 


const connectDB =  async  ()=>{
    try { 
        const dbConnection = await mongoose.connect(`${process.env.MONGO_DB_URL}`) 
        console.log("successfully connected to mongo db cluster ! ") ; 
    }
    catch(e) { 
        console.log(`Error occurred while connecting to mongo db cluster ! `); 
    }
}
export default connectDB ; 