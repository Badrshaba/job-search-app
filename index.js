import express from "express"
import userRouter from "./src/modules/User/user.routes.js"
import companyRouter from "./src/modules/Company/company.routes.js"
import jobRouter from "./src/modules/Job/job.routes.js"
import db_connection from "./DB/connection.js";
import { config } from "dotenv";
import { globalResponse } from "./src/middlewares/global.middlewares.js";
config()

const app = express()

app.use(express.json())
app.use("/user",userRouter)
app.use("/company",companyRouter)
app.use("/job",jobRouter)
app.use(globalResponse)






db_connection()
app.listen(3000,()=>{
    console.log("server running........");
})