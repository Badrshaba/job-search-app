import { Router } from "express";
import * as userController from "./user.controller.js"
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middlewares/validation.middlewares.js";
import {forgetPasswordSchema, getAllAccountsSchema, getAntherUserSchema, signInSchema, signUpSchema, updataAccountSchema, updatePasswordSchema} from "./user.validation.js"
import { auth } from "../../middlewares/auth.middlewares.js";

const router = Router()

router.post("/sign_up",validationMiddleware(signUpSchema),expressAsyncHandler(userController.signUp))
router.post("/signIn",validationMiddleware(signInSchema),expressAsyncHandler(userController.signIn))
router.put("/update_account",auth(),validationMiddleware(updataAccountSchema),expressAsyncHandler(userController.UpdateAccount))
router.delete("/delete_user",auth(),expressAsyncHandler(userController.deleteAccount))
router.get("/",auth(),expressAsyncHandler(userController.getUserAccountData))
router.get("/profile_user/:id",validationMiddleware(getAntherUserSchema),expressAsyncHandler(userController.getAntherUserData))
router.put("/updatePassword",auth(),validationMiddleware(updatePasswordSchema),expressAsyncHandler(userController.updataPassword))
router.post("/forgetPassword",validationMiddleware(forgetPasswordSchema),expressAsyncHandler(userController.forgetPassword))
router.get("/allusers",auth(),validationMiddleware(getAllAccountsSchema),expressAsyncHandler(userController.getAllAccounts))

export default router 