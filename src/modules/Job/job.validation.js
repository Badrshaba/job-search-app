import Joi from "joi"
import { Types } from "mongoose"

//============== object Id validator =============== //

const objectIdValidation = (value,helper)=>{
    const isvalid = Types.ObjectId.isValid(value)
    return isvalid ? value : helper.message('invalid objectId')
}


//============== Add Job schema =============== //

export const addJobSchema = {
    body: Joi.object({
        jobTitle: Joi.string(),
        jobLocation: Joi.string().valid("hybrid","remotely","onsite"),
        workingTime: Joi.string().valid("part-time","full-time"),
        seniorityLevel: Joi.string().valid("Junior", "Mid-Level", "Senior","Team-Lead", "CTO"),
        jobDescription: Joi.string(),
        technicalSkills: Joi.array(), 
        softSkills: Joi.array(),
        companyID: Joi.string().custom(objectIdValidation),
    }).options({ presence: 'required' })
}


//============== Update Job schema =============== //

export const updateJobSchema = {
    body: Joi.object({
        jobTitle: Joi.string(),
        jobLocation: Joi.string().valid("hybrid","remotely","onsite"),
        workingTime: Joi.string().valid("part-time","full-time"),
        seniorityLevel: Joi.string().valid("Junior", "Mid-Level", "Senior","Team-Lead", "CTO"),
        jobDescription: Joi.string(),
        technicalSkills: Joi.array(), 
        softSkills: Joi.array(),
    }),
    params:Joi.object({
        id:Joi.string().custom(objectIdValidation).required()
    })
}


//============== Delete Job schema =============== //

export const deleteJobSchema = {
    params:Joi.object({
        _id:Joi.string().custom(objectIdValidation).required()
    })
}


//============== Get all Jobs for a specific company schema =============== //

export const getAllJobsSchema = {
    query:Joi.object({
        companyName:Joi.string().required()
    })
}


//============== Get all Jobs that match the following filters schema =============== //

export const filterJobsSchema = {
    body:Joi.object({
        jobLocation:Joi.string().valid("hybrid","remotely","onsite"),
        workingTime:Joi.string().valid("part-time","full-time"),
        jobTitle:Joi.string().valid("Junior", "Mid-Level", "Senior","Team-Lead", "CTO"),
        seniorityLevel:Joi.string(),
        technicalSkills:Joi.array(),
    })
}


//============== Apply to Job schema =============== //

export const applyJobSchema = {
    query:Joi.object({
        jobId:Joi.string().custom(objectIdValidation).required(),
        userSoftSkills:Joi.array().required(),
        userTechSkills:Joi.array().required(),
    })
}