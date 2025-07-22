const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler=require("express-async-handler");
// registration
const register = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    // validate
    if (!username || !email || !password) {
      res.status(400);
      throw new Error('Please all fields are required');
    }

    // check email taken or not
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const trialPeriodDays = 3;
    const trialExpires = new Date(Date.now() + trialPeriodDays * 24 * 60 * 60 * 1000);
    const newUser = new User({
    username,
    password: hashedPassword,
    email,
    trialPeriod: trialPeriodDays,
    trialExpires,
});


    // save user
    await newUser.save();

    res.json({
      status: true,
      message: "Registration was successful",
      user: {
        username,
        email,
      },
    });

}
);

// login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // find user by email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // create JWT
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );

  // set cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  });

  // ✅ send token also in response body for frontend localStorage
  res.json({
    status: 'success',
    _id: user._id,
    username: user.username,
    email: user.email,
    message: 'Login success',
    token, // ✅ added this
  });
});

// logout
const logout=asyncHandler(async()=>{
  res.cookie('token','',{maxAge:1});
  res.status(200).json({message:'Logged out successfully'});

});
// profile
const userProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?.id)
  .select("-password")
  .populate("payments")
  .populate("contentHistory");

  if (user) {
    const userWithVirtuals = user.toObject({ virtuals: true }); 
    res.status(200).json({
      status: "success",
      user: userWithVirtuals,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// check user auth status
const checkAuth = asyncHandler(async (req, res) => {
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  if (decoded) {
    res.json({
      isAuthenticated: true,
    });
  } else {
    res.json({
      isAuthenticated: false,
    });
  }
});

module.exports = {
  register,
  login,
  logout,
  userProfile,
  checkAuth,
};
