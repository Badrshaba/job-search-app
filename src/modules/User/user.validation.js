import Joi from "joi"
import { Types } from "mongoose"

//============== object Id validator =============== //

const objectIdValidation = (value,helper)=>{
    const isvalid = Types.ObjectId.isValid(value)
    return isvalid ? value : helper.message('invalid objectId')
} 


//============== Sign Up schema =============== //

export const signUpSchema = {
    body: Joi.object({
        firstName: Joi.string().min(3).max(10).required(),
        lastName: Joi.string().min(3).max(10).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        recoveryEmail: Joi.string().email().required(),
        favoriteColor: Joi.string().required(),
        DOB: Joi.string(), 
        mobileNumber: Joi.string().required() ,
        role:Joi.string().valid("User","Company_HR") 
    })
}


//============== Sign In schema =============== //

export const signInSchema = {
    body: Joi.object({
        mobileNumber: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string().required(),
    })  
}


//============== updata account schema =============== //

export const updataAccountSchema = {
    body: Joi.object({
        mobileNumber: Joi.string(),
        email: Joi.string().email(),
        recoveryEmail: Joi.string().email(),
        DOB: Joi.date(),
        lastName: Joi.string(),
        firstName: Joi.string(),
    })  
}
 

//============== Get profile data for another user schema =============== //

export const getAntherUserSchema = {
    params:Joi.object({
        id:Joi.string().custom(objectIdValidation).required()
    })
}


//============== Update password schema =============== //

export const updatePasswordSchema = {
    body:Joi.object({
        id:Joi.string().custom(objectIdValidation).required()
    })
}


//============== Forget password schema =============== //

export const forgetPasswordSchema = {
    body:Joi.object({
        recoveryEmail:Joi.string().email(),
        email:Joi.string().email(),
        OTP:Joi.string().length(6),
        favoriteColor:Joi.string(),
        newPassword:Joi.string()
    })
}


//============== Get all accounts associated to a specific recovery Email schema =============== //

export const getAllAccountsSchema = {
    body:Joi.object({
        recoveryEmail:Joi.string().email().required()
    })
}