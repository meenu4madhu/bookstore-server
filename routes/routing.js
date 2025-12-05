// import express
const express = require('express')
// import usercontroller
const userController = require('../controllers/userController')

// create router object
const router = new express.Router()

// define path for client api request
// register

router.post('/register',userController.registerController)
module.exports=router;