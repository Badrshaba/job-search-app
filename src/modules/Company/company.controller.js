import Application from "../../../DB/model/application.model.js"
import Company from "../../../DB/model/company.model.js"
import JOb from "../../../DB/model/job.model.js"
import fs from 'fs'


//============== Add company  =============== //

export const addCompany = async(req,res,next)=>{
    /**
     * get all date from req.body
     * check if company name is exist
     * check if compant email is exist
     * create company 
     */
    const {companyName ,description,industry,address,numberOfEmployees,companyEmail } = req.body
    const {_id} =req.authUser
    // check company name
    const checkCompanyName = await Company.findOne({companyName})
    if (checkCompanyName) return next(new Error("company name is already exist",{cause:409}))
    // check company email
    const checkCompanyEmail = await Company.findOne({companyEmail})
    if (checkCompanyEmail) return next(new Error("company email is already exist",{cause:409}))
    // create company
    await Company.create({companyName ,description,industry,address,numberOfEmployees,companyEmail,companyHR:_id })
    res.status(201).json({message:"success"})
}
 
 
//============== Update company data =============== //

export const updateCompany = async (req,res,next)=>{
    /**
     * get all data wont updated from req.body
     * get id of company from req.params
     * check new company name is not exist if user send it
     * check new company email is not exist if user send it
     * update company 
     * field updated send error
     */
    const {companyName ,description,industry,address,numberOfEmployees,companyEmail } = req.body
    const { id } = req.params
    const {_id} =req.authUser
    // check company name
    const checkCompanyName = await Company.findOne({companyName})
    if (checkCompanyName) return next(new Error("company name is already exist",{cause:409}))
    // check company email
    const checkCompanyEmail = await Company.findOne({companyEmail})
    if (checkCompanyEmail) return next(new Error("company email is already exist",{cause:409}))
    // update comapny     
    const companyUpdate = await Company.updateOne({_id:id,companyHR:_id },{companyName ,description,industry,address,numberOfEmployees,companyEmail })
    if (!companyUpdate.modifiedCount) return next(new Error("error update",{cause:400}))
    res.status(200).json({message:"success"})
}


//============== Delete company data =============== //

export const deleteCompany = async (req,res,next)=>{
    /**
     * get id company from params
     * get id company hr from authuser
     * delete one 
     * field deleted send error
     */
    const {id} = req.params
    const {_id} = req.authUser
    const companyDelete = await Company.deleteOne({_id:id,companyHR:_id})
    if (!companyDelete.deletedCount) return next(new Error("not deleted",{cause:400}))
    res.status(200).json({message:"success"})
}


//============== Get company data =============== //

export const getCompanyData = async (req,res,next)=>{
    /**
     * get company id from req.params
     * find company by id 
     * it's supposed to use virtual populate but i I do not want search so i well use lean
     * find all jobs by company id
     * push this jobs to company object
     * send this object
     */
    const {id} = req.params
    const company = await Company.findById(id).lean()
    const jobs = await JOb.find({companyID:company._id})
    company.jobs = jobs
    res.status(200).json({message:"success",data:company})
}


//============== Search for a company with a name =============== //

export const searchForCompany = async(req,res,next)=>{
    /**
     * get char or word of company name
     * find company by reqexp and i 
     */
    const {search} = req.query 
    const searchRegex = new RegExp(`^${search}`, 'i');
    const company = await Company.find({companyName:{$regex:searchRegex}});
    if(!company.length) return res.status(200).json({message:"not found"})
    res.status(200).json({message:"result",data:company})
}


//============== Get all applications for specific Jobs  =============== //

export const getApllications = async(req,res,next)=>{
    /**
     * get email company and job title from query
     * company find one by companyEmail and companyHR
     * if found job find one by jobTitle and ad
     */
    const {_id} = req.authUser
    const {jobTitle , companyEmail} = req.query 
    const isExistCompany = await Company.findOne({companyHR:_id,companyEmail})
    if (!isExistCompany) return next(new Error("company not exist",{cause:404}))
    const job = await JOb.findOne({jobTitle , companyID:isExistCompany._id})
    const applications = await Application.find({jobId:job._id}).populate('userId')
    res.status(200).json({message:"result",data:applications})

}


//================== Bonus Points / the applications for a specific company on a specific day and create an Excel sheet =====//

export const createExcelSheet = async(req,res,next)=>{
    const {companyName , created_at} = req.body 
    const company = await Company.findOne({companyName}).lean()
    if (!company) return next(new Error("company name not exist",{cause:404}))
    const jobs = await JOb.find({addedBy:company.companyHR}).select('_id')
    let applications = [];
      applications.push(Object.keys( await Application.findOne().select('-userResume -__v -updatedAt').lean()))
    let arr = []
    let arr2 = [] 
    for(let job of jobs){
       const getApplications = await Application.find({jobId:job._id,created_at},'-userResume -__v -updatedAt').lean()
       if(getApplications.length) arr.push(getApplications)}
    for(let ar of arr)
        for(let a of ar)
            arr2.push(Object.values(a))
    applications.push(...arr2)
    let app = applications.map((ele)=> ele.map((e=>e.toString().replace(",","-"))))
     const csvContent = app.map(row => row.join(',')).join('\n');
     const filePath = 'output.csv';
     fs.writeFileSync(filePath, csvContent, 'utf-8');
    console.log(csvContent);
    res.status(200).json({message:"success"})

}


