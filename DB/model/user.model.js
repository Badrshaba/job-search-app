import { Schema, model } from "mongoose";


const userSchema = new Schema({
    firstName:{
        type:String,
        require:true, 
        trim:true
    },
    lastName:{
        type:String,
        require:true,
        trim:true
    },
    username:{
        type:String,
        require:true,
        trim:true
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    recoveryEmail:{
        type:String,
        required:true,
    },
    favoriteColor:{
        type:String,
        required:true,
    },
    DOB:String,
    mobileNumber:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:["User","Company_HR"],
        default:"User",
    },
   status:{
    type:String,
        enum:["online","offline"],
        default:"offline",
   }

},{timestamps:true})

const User = model('user',userSchema)

export default User