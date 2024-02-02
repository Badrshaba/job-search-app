import moment from "moment";
import { Schema, model } from "mongoose";


const OTPSchema = new Schema({
    OTP:{
        type:String,
        require:true, 
        unique:true,
        length:6
    },
    recoveryEmail:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    favoriteColor:{
        type:String,
        required:true,
    },
    create_at:{
        type:String,
        default:moment().format('L HH:mm')
    },

},{timestamps:{ createdAt: 'create_at' }})

const OTPModel = model('OTP',OTPSchema)

export default OTPModel