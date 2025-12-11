const mongoose = require('mongoose')
// get connection string from .env file
const connectionString = process.env.ATLASDBCONNECTION

mongoose.connect(connectionString).then(res=>{
    console.log("MongoDB connection Successfull");
    
}).catch(err=>{
    console.log("Dtabase connection failed !!");
    console.log(err);
    
    
})