

import pkg from 'bcrypt'
import {userModel}  from '../../../DB/model/user.js'
import { generateToken } from '../../utilities/tokenFunction.js'




export const register = async(req,res,next) => {
    const { 
        username,
        email,
        password,
    } = req.body

    //is email exsisted
    const isExsisted = await userModel.findOne({email})
    if(isExsisted){
        return res.status(400).json({message:"Email exsisted"})
    }

    const hashedPassword = pkg.hashSync(password, +process.env.SALT_ROUNDS)
    
    const user = new userModel({
        username,
        email,
        password:hashedPassword,
    })
    const saveUser = await user.save()
    res.status(201).json({message:'done', saveUser})
} 


export const login =  async(req,res,next) => {
    const {email,password} = req.body

     
    if(!email || !password){
        return res.status(422).json({message:"Email And Password Is Required"})
     }

    const userExsist = await userModel.findOne({email})
    if(!userExsist){
        return res.status(404).json({message:"user not found"})

    } 

     
    const passwordExsist = pkg.compareSync(password,userExsist.password)
 
    
    if(!passwordExsist){
        return res.status(404).json({message:"password incorrect"})
    }

    const token = generateToken({
        payload:{
            email,
            _id: userExsist._id,
            role: userExsist.role
        },
        signature: process.env.SIGN_IN_TOKEN_SECRET,  
        expiresIn: '1h',
     })
     

     const userUpdated = await userModel.findOneAndUpdate(
        
        {email},
        
        {
            token,
 
        },
        {new: true},
     )
     res.status(200).json({message: 'Login Success', userUpdated})
}


