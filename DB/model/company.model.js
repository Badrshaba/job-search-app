import { Schema, model } from "mongoose";


const companySchema = new Schema({
    companyName:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    description:{
        type:String,
        require:true,
    },
    industry:{
        type:String,
        require:true,
    },
    address:{
        type:String,
        required:true,
    },
    numberOfEmployees:{
        from:{type:Number,required:true,},
        to:{type:Number,required:true,},
    },
    companyEmail:{
        type:String,
        required:true,
        unique:true,
    },
    companyHR:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true,
    }

},{timestamps:true})

const Company = model('company',companySchema)

export default Company

