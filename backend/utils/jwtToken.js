// Create Token and saving in cookie

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
    const safeUser = {
      _id:user._id,
      name: user.name,
      email: user.email,
      picture:user.picture,
      role: user.role,
      createdClasses:user.createdClasses,
      joinedClasses:user.joinedClasses,
      createdAt: user.createdAt,
    };
    // options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user:safeUser,
      token,
    });
  };
  
  module.exports = sendToken;
  