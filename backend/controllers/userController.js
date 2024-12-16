const Errohandler = require('../utils/errorhandler')
const catchAsyncError = require('../middleware/catchAsyncErrors')

const User = require('../models/userModel')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require('../utils/jwtToken')


//register user

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "this is a sample id",
            url: "this is a url",

        }
    })
    sendToken(user, 201, res)


})


//login

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    //check user has given or not
    if (!email || !password) {
        return next(new Errohandler("please enter email and password", 400))
    }

    const user =await User.findOne({ email }).select("+password");

    if (!user) return next(new Errohandler("Invalid email or password", 401))

    const isPasswordMatched =await user.comparePassword(password);
    if (!isPasswordMatched) return next(new Errohandler("Invalid email or password", 401))

    sendToken(user, 200, res)




})

//logout
exports.logout=catchAsyncError(async(req, res, next)=>{

    res.cookie('token', '', {
        expires: new Date(0),
        httpOnly: true,
        secure: true, 
        sameSite: 'None',
      });

    res.status(200).json({
        success:true,
        message:"logged out"
    })
})





//get user details

exports.getUserDetails= catchAsyncError(async(req, res, next)=>{

    const user= await User.findById(req.user.id)
  
    res.status(200).json({
        success:true,
        user,
    })
})





//update profile

exports.updateProfile= catchAsyncError(async(req, res, next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        //avatae later TODO:
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    res.status(200).json({
        success:true,

    })
})

//get all users (admin)

exports.getAllUsers= catchAsyncError(async(req, res, next)=>{
    
    const users= await User.find();
    
   return res.status(200).json({
        success:true,
        users,
    })
})

//get single users (admin)

exports.getSingleUsers= catchAsyncError(async(req, res, next)=>{
    
    const user= await User.findById(req.params.id);
    if(!user) return next(new Errohandler(`user doesnot exist with id ${req.params.id}`))

    res.status(200).json({
        success:true,
        user,
    })
})

//update user role admin
exports.updateRole= catchAsyncError(async(req, res, next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
        //avatae later TODO:
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    if(!user) {
        return next(new Errohandler('user does not exiist', 404))
    }
    
    res.status(200).json({
        success:true,

    })
})

//delete user admin

exports.deleteUser= catchAsyncError(async(req, res, next)=>{

    const user= await User.findById(req.params.id)
    //cloudinary remove
    if(!user) {
        return next(new Errohandler('user does not exiist', 404))
    }
    await user.deleteOne();
    res.status(200).json({
        success:true,
        message:"user deleted successfully"

    })
})
