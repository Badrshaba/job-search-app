import User from "../../../DB/model/user.model.js";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import moment from "moment";
import { customAlphabet  } from "nanoid";
import OTPModel from "../../../DB/model/OTP.model.js";

//============== Sign Up =============== //

export const signUp = async (req, res, next) => {
  /**
   * get all data from req.body
   * check email is exist
   * check mobile number is exist
   * hash password
   * create user
   */
  const { firstName,lastName, email, password,recoveryEmail,favoriteColor, DOB, mobileNumber,role } = req.body;
  // email check
  const emailCheck = await User.findOne({ email });
  if (emailCheck)
    return next(new Error("email is already exist", { cause: 409 }));
  // mobile number check
  const mobileCheck = await User.findOne({mobileNumber}) 
  if (mobileCheck)
    return next(new Error("mobile is already exist", { cause: 409 }));
  // hash password
  const hashPassword = bcrypt.hashSync(password, +process.env.HASH_PASSWORD);
  // create user
  await User.create({ firstName,lastName,username:firstName+" "+lastName, email, password:hashPassword,recoveryEmail,favoriteColor, DOB:moment(DOB).format('L'), mobileNumber,role });
  res.status(201).json({ message: "done" });
};


//============== Sign In =============== //

export const signIn = async (req, res, next) => {
  /**
   * get all data from req.body 
   * if user send email check, is it exist
   * if user send mobile number check , is it exist
   * check if password matched
   * update status user by mobile number or email
   * create token
   * send token
   */
  const { mobileNumber, email, password } = req.body;
  let user;
  // user check
  if (mobileNumber) {
    const userCheck = await User.findOne({ mobileNumber });
    if (!userCheck) return next(new Error("invalid login", { cause: 400 }));
    user=userCheck
  }
  if (email) {
    const userCheck = await User.findOne({ email });
    if (!userCheck) return next(new Error("invalid login", { cause: 400 }));
    user=userCheck
  }
  // password matched
  const passwordMatched = bcrypt.compareSync(password, user.password);
  if (!passwordMatched)
    return next(new Error("invalid login", { cause: 400 }));
  // chagne status mobileNumber
  if (mobileNumber) await User.updateOne({mobileNumber},{status:"online"}) 
  if (email) await User.updateOne({email},{status:"online"}) 
  // create token
  const token = jwt.sign({id:user._id,email:user.email},process.env.TOKEN)
  // create user
  res.status(200).json({ message: "success" ,token});
};


//============== update account =============== //

export const UpdateAccount = async (req,res,next)=>{ 
  /**
   * find user by id
   * give defult names to last name and first name for user name
   * get all data from req.body
   * check if new email is exist if user send it
   * check if new mobile number is exist if user send it
   * update user
   * if field update send error
   */
  const { _id} =req.authUser
  const user = await User.findById(_id)
  const {email , mobileNumber , recoveryEmail , DOB , lastName=user.lastName , firstName=user.firstName} = req.body
  // check email
  if(email){
  const emailCheck = await User.findOne({email})
  if (emailCheck) return next(new Error("email is already exist", { cause: 409 }));
  }
  // check mobile number
  if(mobileNumber){
    const mobileNumberCheck = await User.findOne({mobileNumber})
    if (mobileNumberCheck) return next(new Error("Mobile Number is already exist", { cause: 409 }));
  }
  const userUpdate = await User.updateOne({_id},{username:firstName+" "+lastName , email , mobileNumber , recoveryEmail , DOB , lastName , firstName})
  if(!userUpdate.modifiedCount) return next(new Error("invalid update", { cause: 400 }));
  res.status(200).json({message:"success"})
}


//============== Delete account =============== //

export const deleteAccount = async (req,res,next)=>{
  /**
   * get user id from auth user
   * delete user 
   * if field deleted send error
   */
  const {_id} =req.authUser
  const userDelete = await User.deleteOne({_id})
  if (!userDelete.deletedCount) return next(new Error("invalid delete", { cause: 400 }));
  res.status(200).json({message:"success"})
}


//============== Get user account data  =============== //

export const getUserAccountData = async(req,res,next)=>{
  /**
   * get user id from authUser
   * find user by id
   * send user data
   */
  const {_id} = req.authUser
  const user = await User.findById(_id)
  res.status(200).json({message:"result",data:user})
}


//============== Get profile data for another user =============== //

export const getAntherUserData = async(req,res,next)=>{
  /**
   * get user id from req.params
   * find user by id
   * check if user not found
   * send user data 
   */
  const {id} = req.params 
  const user = await User.findById(id)
  if(!user) return res.status(200).json({message:"not found"})
  res.status(200).json({message:"result",data:user})
}


//============== Update password  =============== //

export const updataPassword = async(req,res,next)=>{
  /**
   * get new password from req.body
   * get id account from req.authuser
   * hash password
   * update user
   * if field update send error
   */
  const {password}=req.body
  const {_id} = req.authUser
  // hash password
  const hashPassword = bcrypt.hashSync(password, +process.env.HASH_PASSWORD);
  const userUpdate = await User.updateOne({_id},{password:hashPassword})
  if(!userUpdate.modifiedCount) return next(new Error("error update", { cause: 404 }));
  res.status(200).json({message:"success"})
}


//============== Forget password =============== //

export const forgetPassword = async(req,res,next)=>{
  /**
   * get all data from req.body
   * if user send recoveryEmail and email and doesn't OTP and new password
   * check if user exist by recoveryEmail and email
   * craete OTP
   * create otp model and save recoveryEmail , email and otp
   * send otp 
   * *****************************************************************
   * if user send otp and new password and her favorite color
   * find one otp model by otp 
   * get user email 
   * find one user model by email and favoriteColor
   * if user found 
   * hash new password
   * update user
   * field update end error
   * delete one otp model by otp
   * */
  const { recoveryEmail , email , OTP , newPassword ,favoriteColor } = req.body
  // check if this first time 
  if(recoveryEmail && email && !OTP && !newPassword){
  // check email and recoveryEmail
  const emailCheck = await User.findOne({recoveryEmail , email}) 
  if(!emailCheck) return next(new Error("error recoveryEmail or email", { cause: 404 }));
  // create OTP
  const nanoid = customAlphabet('0123456789')
  const OTPCreate = nanoid(6)
  await OTPModel.create({OTP:OTPCreate , recoveryEmail , email ,favoriteColor:emailCheck.favoriteColor})
  res.status(200).json({message:"invalid OTP after 1 Hour \n send OTP and your favorite color ",OTP:OTPCreate})
  }else if( OTP && newPassword && favoriteColor){
    // create time by day
    const OTPcheck = await OTPModel.findOne({OTP , favoriteColor})
    // check OTP
    if (!OTPcheck) return next(new Error("invalid OTP ",{cause:400}))
    const date = moment(new Date()).format('L HH:mm').split(" ")
    const dateOTP = OTPcheck.create_at.split(" ")
    const day = date[0] == dateOTP[0]
    // // check if the same day
     if(!day) return next(new Error("invalid OTP ",{cause:400}))
    // create time by hour
    const hour = +date[1].replace(":",".") 
    const hourOTP = +dateOTP[1].replace(":",".")
    // check if not passed a hour to create OTP
    if( hour+1 < hourOTP ) return next(new Error("invalid OTP ",{cause:400}))
    // update new password
    const hashPassword = bcrypt.hashSync(newPassword, +process.env.HASH_PASSWORD);
    const userUpdate = await User.updateOne({email:OTPcheck.email},{password:hashPassword})
    if(!userUpdate.modifiedCount) return next(new Error("error update", { cause: 404 }));
    // // delete OTP from DB
    await OTPModel.deleteOne({OTP})
    res.status(200).json({message:"success"}) 
  }else
  next(new Error("invalid ",{cause:400}))
}


//============== Get all accounts associated to a specific recovery Email =============== //

export const getAllAccounts = async(req,res,next)=>{
  /**
   * get recoveryEmail from req.body
   * find all users have tha same recoveryEmail
   * if length =0 send not found
   */
  const {recoveryEmail} = req.body 
  const users = await User.find({recoveryEmail})
  if(!users.length) return res.status(200).json({message:"not found"})
  res.status(200).json({message:"result",data:users})
}
