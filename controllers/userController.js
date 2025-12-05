// register api request
exports.registerController = (req,res)=>{
    console.log("Inside Register controller");
    const {username,email,password}=req.body
    console.log(username,email,password);
    
    res.status(200).json("Request Recieved")
    
}
// login api
// useredit profile
// admin edit profile
