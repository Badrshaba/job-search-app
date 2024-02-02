import JOb from "../../../DB/model/job.model.js"
import Company from "../../../DB/model/company.model.js"
import cloudinaryConnection from "../../utils/cloudinary.js"
import Application from "../../../DB/model/application.model.js"

//============== Add Job =============== //

export const addJob = async (req,res,next)=>{
    /**
     * get add job data from req.body
     * get id addedBy from auth
     * check company id is exist
     * creare job
     */ 
    const {jobTitle,jobLocation,workingTime,seniorityLevel,companyID,jobDescription,technicalSkills,softSkills} = req.body
    const {_id} = req.authUser
    // check company found
    const isFoundCompany = await Company.findById(companyID)
    if(!isFoundCompany) return next(new Error("company not exist",{cause:404}))
    // create job
    await JOb.create({jobTitle,jobLocation,workingTime,seniorityLevel,companyID,jobDescription,technicalSkills,softSkills,addedBy:_id})
    res.status(201).json({message:"success"})
}


//============== Update Job =============== //

export const updateJob = async (req,res,next)=>{
    /**
     * get data can update it in jobs
     * get job id from params
     * update job
     * check is updated
     */
    const {jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills} = req.body
    const {id} = req.params
    // update job
    const jobUpdate = await JOb.updateOne({_id:id},{jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills})
    if(!jobUpdate.modifiedCount) return next(new Error("error update",{cause:400}))
    res.status(200).json({message:"success"})
}


//============== Delete Job =============== //

export const deleteJob = async (req,res,next)=>{
    /**
     * get id job from params
     * delete job
     * check is deleted
     */
    const {id} = req.params
    const jobDelete = await JOb.deleteOne({_id:id})
    if(!jobDelete.deletedCount) return next(new Error("error delete",{cause:400}))
    res.status(200).json({message:"success"})
}


//============== Get all Jobs with their company’s information =============== //

export const getAllJob = async (req,res,next)=>{
    /**
     * find all jobs 
     * populate company id
     */
    const jobs = await JOb.find().populate('companyID')
    res.status(200).json({message:"success",data:jobs})
}


//============== Get all Jobs for a specific company =============== //

export const jobsForSpecificCompany = async (req,res,next)=>{
    /**
     * get company name in query 
     * find one in company model by company name because it unique
     * get id this company
     * find all jobs has this id in field company id
     */
    const {companyName} = req.query
    const company = await Company.findOne({companyName})
    const jobs = await JOb.find({companyID:company._id})
    res.status(200).json({message:"success",data:jobs})
}


//============== Get all Jobs that match the following filters  =============== //

export const filterJobs = async (req,res,next)=>{
    /**
     * get all date can filter by it in req.body
     * create object 
     * if data get push this date in object 
     * find by this object
     */
    const {jobLocation  ,workingTime ,jobTitle , seniorityLevel , technicalSkills} = req.body 
    const filter = {};
    if(jobLocation) filter.jobLocation=jobLocation
    if(workingTime) filter.workingTime=workingTime
    if(jobTitle) filter.jobTitle=jobTitle
    if(seniorityLevel) filter.seniorityLevel=seniorityLevel
    if(technicalSkills?.length) filter.technicalSkills={$all:technicalSkills}
    const jobs = await JOb.find(filter)
    res.json({
        message:"result",
        data:jobs
    })

} 

//============== Apply to Job =============== //

export const applyJob = async (req,res,next)=>{
    /**
     * get skills user and job id from req.quey
     * get user id from req.authuser
     * upload resume
     * create application
     */
    const {_id  } = req.authUser
    const { userTechSkills , userSoftSkills , jobId } = req.query
   // userResume 
   const {secure_url,public_id} = await cloudinaryConnection().uploader.upload(req.file.path,{
    folder:`Application/Resume`,
   })

   await Application.create({jobId,userId:_id,userTechSkills , userSoftSkills , userResume:{secure_url,public_id}})
   res.status(201).json({message:"success"})

}
 
