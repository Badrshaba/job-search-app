import Joi from "joi"
import { Types } from "mongoose"


//============== objectid validator  =============== //

const objectIdValidation = (value,helper)=>{
    const isvalid = Types.ObjectId.isValid(value)
    return isvalid ? value : helper.message('invalid objectId')
}


//============== Add company schema =============== //

export const addCompanySchema = {
    body:Joi.object({
        companyName:Joi.string(),
        description:Joi.string(),
        industry:Joi.string(),
        address:Joi.string(),
        numberOfEmployees:Joi.object(),
        companyEmail:Joi.string().email()
    }).options({ presence: 'required' })
}  


//============== Update company schema =============== //

export const updateCompanySchema = {
    body:Joi.object({
        companyName:Joi.string(),
        description:Joi.string(),
        industry:Joi.string(),
        address:Joi.string(),
        numberOfEmployees:Joi.object(),
        companyEmail:Joi.string().email()
    }),
    params:Joi.object({
        id:Joi.string().custom(objectIdValidation).required()
    })

} 


//============== Delte company schema =============== //

export const deleteCompanySchema ={
    params:Joi.object({
        id:Joi.string().custom(objectIdValidation).required()
    })
}


//============== Get company data schema =============== //

export const getCompanyDataSchema ={
    params:Joi.object({
        id:Joi.string().custom(objectIdValidation).required()
    })
} 


//============== Search for a company with a name schema =============== //

export const searchForCompanySchema ={ 
    query:Joi.object({
        search:Joi.string().required()
    })
}


//============== Get all applications for specific Jobs schema =============== //

export const getAllApllicationsSchema ={ 
    query:Joi.object({
        jobTitle:Joi.string().required(),
        companyEmail:Joi.string().email().required()
    })
}


//============== create excel sheet schema  =============== //

export const createExcelSheetSchema ={
    body:Joi.object({
        companyName:Joi.string(),
        created_at:Joi.string(),
    }).options({ presence: 'required' })
} 