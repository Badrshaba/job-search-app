import moment from "moment";
import { Schema, model } from "mongoose";


const applicationSchema = new Schema({
    jobId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"job"
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
    userTechSkills:{
        type:Array,
        required:true,
    },
    userSoftSkills:{
        type:Array,
        required:true,
    },
    userResume:{
     secure_url :{type:String,required:true},
     public_id :{type:String,required:true,unique:true}
    },
    created_at:{
        type:String, 
        default:moment().format('L')
    }

},{timestamps: { createdAt: 'created_at' }})

const Application = model('application',applicationSchema)

export default Application

