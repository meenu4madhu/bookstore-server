const books = require('../models/bookModel')
const stripe = require('stripe')(process.env.STRIPESECRET);
// add book
exports.addBookController = async (req,res)=>{
    console.log("Inside addBookController");
     
    // get book details from request req body , upload files from request files & seller mail from req payload
    const {title,author,pages,price,discountPrice,imageURL,abstract,language,publisher,isbn,category} = req.body
    const uploadImages = req.files.map(item=>item.filename)
    const sellerMail = req.payload
    console.log(title,author,pages,price,discountPrice,imageURL,abstract,language,publisher,isbn,category,uploadImages,sellerMail);
    try{
        // check book already exists
        const existingBook = await books.findOne({title,sellerMail})
        if(existingBook)
        {
            res.status(401).json("Uploaded book is already exists... Request failes!!!!!!!!")

        }else{
            const newBook = await books.create({
                title,author,pages,price,discountPrice,imageURL,abstract,language,publisher,isbn,category,uploadImages,sellerMail
            })
            res.status(200).json(newBook)
        }
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
    
   
  
}

// get home books - guest user
exports.getHomeBooksController = async (req,res)=>{
    console.log("Inside getHomeBooksController");
     
   try{
        // get newly added 4 books from db
        const homeBooks = await books.find().sort({_id:-1}).limit(4)
        res.status(200).json(homeBooks)
       
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
    
   
  
}

// get all books-login  user
exports.getUserAllBookPageController = async (req,res)=>{
    console.log("Inside getUserAllBookPageController");
    // query from request
        const searchKey = req.query.search 
      console.log(searchKey);
        
    // login user mail from token
     const loginUserMail = req.payload
   try{
        // get all books from db expect loggin user
        const allBooks = await books.find({sellerMail:{$ne:loginUserMail},title:{$regex:searchKey,$options:'i'}})
        res.status(200).json(allBooks)
       
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
    
   
  
}



// get all user uploaded books
exports.getUserUploadedBookProfilePageBookController = async (req,res)=>{
    console.log("Inside getUserProfilePageBookController");
    //get login user mail from token
     const loginUserMail = req.payload
   try{
        // get all books uploaded by  user
        const allUserBooks = await books.find({sellerMail:{$eq:loginUserMail}})
        res.status(200).json(allUserBooks)
       
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
    
   
  
}

// get all user bought books
exports.getUserBoughtBookProfilePageBookController = async (req,res)=>{
    console.log("Inside getUserBoughtBookProfilePageBookController");
    //get login user mail from token
     const loginUserMail = req.payload
   try{
        // get all purchasedbook 
        const allUserPurchaseBooks = await books.find({buyerMail:loginUserMail})
        res.status(200).json(allUserPurchaseBooks)
       
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
    
   
  
}

// .........................................view book controller.......................................
exports.viewBookController = async (req,res)=>{
    console.log("Inside ViewBookController");
    // get book id from req params
    const {id} = req.params
    try{
        // get book details from db
        const bookDetails = await books.findById({_id:id})
        res.status(200).json(bookDetails)
    }
    catch(error){
         console.log(error);
        res.status(500).json(error)
    }
}


// get all books : admin-login

exports.getAllBooksController = async (req,res)=>{
    console.log("Inside getAllBooksController");
    
    
   try{
        // get all books from db 
        const allBooks = await books.find()
        res.status(200).json(allBooks)
       
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
    
   
  
}

// update book status -admin:login user

exports.UpdateBookStatusController= async (req,res)=>{
    console.log("Inside UpdateBookStatusController");
    
    // get id of book
    const {id}=req.params
   try{
        // getbook details from db
        const bookDetails = await books.findById(id)
        bookDetails.status="approved"
        // save changes to mongodb
        await bookDetails.save();
        res.status(200).json(bookDetails)
       
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
    
   
  
}

// delete userbook- user

exports.deleteBookController= async (req,res)=>{
    console.log("Inside deleteBookController");
    
    // get id of book
    const {id}=req.params
   try{
        // getbook details from db
        const bookDetails = await books.findByIdAndDelete({_id:id})
        
        res.status(200).json(bookDetails)
       
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
    
   
  
}

// payment
exports.bookPaymentController = async(req,res)=>{
console.log("Inside bookPaymentController");
    // const {title,author,pages,price,discountPrice,imageURL,abstract,language,publisher,isbn,category,_id,uploadImages,sellerMail} = req.body
     const email=req.payload 
     const {id}=req.params
    try{

        const bookDetails=await books.findById({_id:id})
        bookDetails.status="sold"
        bookDetails.buyerMail=email
        await bookDetails.save()
        const {title,author,pages,price,discountPrice,imageURL,abstract,language,publisher,isbn,category,_id,uploadImages,sellerMail}=bookDetails
     //Check out session creation
    const line_items =[{
            price_data:{
                currency:'usd',
                product_data:{
                    name:title,
                    description:'${author} | ${publisher}',
                    images:uploadImages,
                    metadata:{
                        title,author,pages,price,discountPrice,imageURL
                    }
                },
                unit_amount:Math.round(discountPrice*100)
            },
            quantity:1
        }] 

  const session = await stripe.checkout.sessions.create({
  
  line_items,
  mode: 'payment',
  success_url: 'http://localhost:5173/user/payment-success',
  cancel_url:'http://localhost:5173/user/payment-error',
  payment_method_types:["card"]
  
  }); 

  console.log(session);
  res.status(200).json({checkoutURL:session.url})
  

   }catch(error){
    console.log(error);
    res.status(500).json(error)
    
   }
}