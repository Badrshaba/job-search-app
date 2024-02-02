import { Schema, model } from "mongoose";


const jobSchema = new Schema({
    jobTitle :{
        type:String,
        required:true,
        trim:true
    },
    jobLocation :{
        type:String,
        require:true,
        enum:["onsite", "remotely", "hybrid"],
    },
    workingTime :{
        type:String,
        require:true,
        enum:["part-time" , "full-time"],
    },
    seniorityLevel:{
        type:String,
        required:true,
        enum:["Junior", "Mid-Level", "Senior","Team-Lead", "CTO"],
    },
    jobDescription:{
        type:String,
        required:true,
    },
    technicalSkills:{
        type:Array,
        required:true,
    },
    softSkills:{
        type:Array,
        required:true,
    },
    companyID:{
        type:Schema.Types.ObjectId,
        ref:"company",
        required:true,
    },
    addedBy:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },

},{timestamps:true})

const JOb = model('job',jobSchema)

export default JOb

