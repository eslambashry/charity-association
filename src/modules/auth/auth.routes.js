import { Router } from "express";
import * as authCont from './auth.controller.js'
 
const userRouter = Router()

userRouter.post('/register',authCont.register)
userRouter.post('/login',authCont.login)

export default userRouter