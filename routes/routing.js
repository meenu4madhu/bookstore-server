// import express
const express = require('express')
// import usercontroller
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const multerMiddleware = require('../middlewares/multerMiddleware')
// create router object
const router = new express.Router()

// define path for client api request
// register

router.post('/register',userController.registerController)
// login
router.post('/login',userController.loginController)
//google login
router.post('/google/sign-in',userController.googleLoginController)
// get home data
router.get('/books/home',bookController.getHomeBooksController)

//--------------------------------- authorised user -----------------------------

// add book -req body content is formdata

router.post('/user/book/add',jwtMiddleware,multerMiddleware.array('uploadImages',3),bookController.addBookController)

// get all books page
router.get('/books/all',jwtMiddleware,bookController.getUserAllBookPageController)

// get all user uploaded books page

router.get('/user-books/all',jwtMiddleware,bookController.getUserUploadedBookProfilePageBookController)

// get all user bought book pages
router.get('/user-books/all',jwtMiddleware,bookController.getUserUploadedBookProfilePageBookController)
// get single- view book details
router.get('/books/:id/view',jwtMiddleware,bookController.viewBookController)
// edit user profile 
// add book -req body content is formdata

router.put('/user/:id/edit',jwtMiddleware,multerMiddleware.single('picture'),userController.updateUserProfileController)


module.exports=router
