import { Router } from "express";
import * as companyController from "./company.controller.js"
import { auth } from "../../middlewares/auth.middlewares.js";
import expressAsyncHandler from "express-async-handler";
import { systemRoles } from "../../utils/systemRoles.js";
import { validationMiddleware } from "../../middlewares/validation.middlewares.js";
import { addCompanySchema, createExcelSheetSchema, deleteCompanySchema, getAllApllicationsSchema, getCompanyDataSchema, searchForCompanySchema, updateCompanySchema } from "./company.validation.js";
const router = Router()

router.post("/search",auth([systemRoles.HR,systemRoles.USER]),validationMiddleware(searchForCompanySchema),expressAsyncHandler(companyController.searchForCompany))
router.use(auth(systemRoles.HR))
router.post("/addcompany",validationMiddleware(addCompanySchema),expressAsyncHandler(companyController.addCompany))
router.put("/updatecompany/:id",validationMiddleware(updateCompanySchema),expressAsyncHandler(companyController.updateCompany))
router.delete("/deletecompany/:id",validationMiddleware(deleteCompanySchema),expressAsyncHandler(companyController.deleteCompany))
router.get("/companydata/:id",validationMiddleware(getCompanyDataSchema),expressAsyncHandler(companyController.getCompanyData))
router.get("/getApplication",validationMiddleware(getAllApllicationsSchema),expressAsyncHandler(companyController.getApllications))
router.get("/createexcelsheet",validationMiddleware(createExcelSheetSchema),expressAsyncHandler(companyController.createExcelSheet))
 


 
export default router  