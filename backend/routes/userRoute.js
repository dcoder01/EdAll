const express= require('express')
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUsers, updateRole, deleteUser } = require('../controllers/userController')
const router= express.Router()
const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth')


router.post('/register',registerUser )
router.post('/login',loginUser )
router.get('/logout', logout)

router.get('/me', isAuthenticatedUser,getUserDetails)
router.put('/me/update', isAuthenticatedUser, updateProfile)
router.get('/admin/users', isAuthenticatedUser,authorizedRoles('admin'), getAllUsers)
router.get('/admin/user/:id', isAuthenticatedUser,authorizedRoles('admin'), getSingleUsers)
router.put('/admin/user/:id', isAuthenticatedUser, authorizedRoles('admin'), updateRole)
router.delete('/admin/user/:id', isAuthenticatedUser, authorizedRoles('admin'), deleteUser)
router.get("/check-auth", isAuthenticatedUser, (req, res) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      message: "Authenticated user!",
      user,
    });
  });

module.exports=router