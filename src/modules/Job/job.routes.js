import { Router } from "express";
import * as jobController from "./job.controller.js"
import { auth } from "../../middlewares/auth.middlewares.js";
import expressAsyncHandler from "express-async-handler";
import { systemRoles } from "../../utils/systemRoles.js";
import { validationMiddleware } from "../../middlewares/validation.middlewares.js";
import { addJobSchema, applyJobSchema, deleteJobSchema, filterJobsSchema, getAllJobsSchema, updateJobSchema } from "./job.validation.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
const router = Router()


router.post("/addjob",auth(systemRoles.HR),validationMiddleware(addJobSchema),expressAsyncHandler(jobController.addJob))
router.put("/updatejob/:id",auth(systemRoles.HR),validationMiddleware(updateJobSchema),expressAsyncHandler(jobController.updateJob))
router.delete("/deletejob/:id",auth(systemRoles.HR),validationMiddleware(deleteJobSchema),expressAsyncHandler(jobController.deleteJob))
router.get("/getalljobs",auth([systemRoles.HR,systemRoles.USER]),expressAsyncHandler(jobController.getAllJob))
router.get("/specificcompany",auth([systemRoles.HR,systemRoles.USER]),validationMiddleware(getAllJobsSchema),expressAsyncHandler(jobController.jobsForSpecificCompany))
router.get("/filterjobs",auth([systemRoles.HR,systemRoles.USER]),validationMiddleware(filterJobsSchema),expressAsyncHandler(jobController.filterJobs))
router.post("/applyjob",auth(systemRoles.USER),validationMiddleware(applyJobSchema),multerMiddleHost(["pdf"]).single('resume'),expressAsyncHandler(jobController.applyJob))



export default router  