const users = require('../models/userModel')
// register api request
// jsonwebtoken
const jwt = require('jsonwebtoken')
exports.registerController = async(req,res)=>{
    console.log("Inside Register controller");
    const {username,email,password}=req.body
    console.log(username,email,password);
    try{
        // check mail in model
        const existingUser = await users.findOne({email})
        if(existingUser){
            res.status(409).json("User Already exist!!! Please Login...")
            
        }
        else{
            const newUser = new users({
                username,email,password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
    // res.status(200).json("Request Recieved")
    
}
// login api

exports.loginController = async(req,res)=>{
    console.log("Inside Register controller");
    const {email,password}=req.body
    console.log(email,password);
    try{
        // check mail in model
        const existingUser = await users.findOne({email})
        if(existingUser){
            if(password == existingUser.password)
            {
            // generate token
            const token = jwt.sign({userMail:existingUser.email,role:existingUser.role},process.env.JWTSECRET)
            res.status(200).json({user:existingUser,token})
            }
            else{
             res.status(401).json("Incorrect Email/Password")
            }
           
            
        }
        else{
           
            res.status(404).json("Account doesn't Exist!!!")
        }
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
    // res.status(200).json("Request Recieved")
    
}
// google login
exports.googleLoginController = async(req,res)=>{
    console.log("Inside Register controller");
    const {email,password,username,picture}=req.body
    console.log(email,password,username,picture);
    try{
        // check mail in model
        const existingUser = await users.findOne({email})
        if(existingUser){
            // login
            // generate token
            const token = jwt.sign({userMail:existingUser.email,role:existingUser.role},process.env.JWTSECRET)
            res.status(200).json({user:existingUser,token})
        }
        else{
        //    register
        const newUser = await users.create({
            username,email,password,picture
        })
        const token = jwt.sign({userMail:newUser.email,role:newUser.role},process.env.JWTSECRET)
            res.status(200).json({user:newUser,token})
        }
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
    // res.status(200).json("Request Recieved")
    
}
// useredit profile
exports.updateUserProfileController = async(req,res)=>{
    console.log("Inside updateUserProfileController");
    // get id from url
    const {id}=req.params
    // get gmail
    const email = req.payload
    // get body text content :username
    const {username,password,bio,role,picture}= req.body
    // get file data
    const uploadImage = req.file?req.file.filename:picture
    console.log(id,email,username,password,bio,role,uploadImage);
    try{
      const updateUser = await users.findByIdAndUpdate({_id:id},{username,email,password,picture:uploadImage,bio,role},{new:true})
      res.status(200).json(updateUser)
    }catch(error){
console.log(error);
res.status(500).json(error)

    }
    
    
}
// admin edit profile
// get all users : admin-login

exports.getAllUsersController = async (req,res)=>{
    console.log("Inside getAllUsersController");
    
    
    
   try{
        // get all users from db 
        const allUsers = await users.find({ role: { $ne: "admin" } })
        res.status(200).json(allUsers)
       
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
    
   
  
}
