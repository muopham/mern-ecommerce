const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/jwt");

const register = asyncHandler(async (req, res) => {
  if (!req.body)
    return res.status(400).json({
      success: false,
      message: "Missing required",
    });
  // tim user co ton tai ko
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  } else {
    // hashPassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
    });
    // tao user moi luu vao db
    const user = await User.create(newUser);
    return res.status(200).json({
      success: user ? true : false,
      message: user ? "Registration successful" : "Registration failed",
    });
  }
});

// login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // ktra cos user ko
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
  // ktra password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({
      success: false,
      message: "Invalid password",
    });
  }
  if (user && validPassword) {
    // tach password va role
    const { password, role, ...other } = user._doc;
    // tao access token
    const accessToken = generateAccessToken(user._id, role);
    // tao refresh token
    const refreshToken = generateRefreshToken(user._id);
    // Lưu refresh token vào database
    await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
    // Lưu refresh token vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      data: other,
    });
  }
});

// logout user
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-refreshToken -password -role");
  if (!users) {
    return res.status(400).json({
      success: false,
      message: "No users found",
    });
  } else {
    return res.status(200).json({
      success: true,
      data: users,
    });
  }
});

// get 1 user
const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const currentUser = await User.findById(_id).select(
    "-refreshToken -password -role"
  );
  return res.status(200).json({
    success: currentUser ? true : false,
    data: currentUser ? currentUser : "User not found",
  });
});

//delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  const user = await User.findByIdAndDelete(_id);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  } else {
    return res.status(200).json({
      success: true,
      message: "User deleted",
    });
  }
});

// update user profile by user
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Missing required",
    });
  }

  const user = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role");
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  } else {
    return res.status(200).json({
      success: true,
      message: "Updated user successfully",
      data: user,
    });
  }
});

// update user by admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Missing required",
    });
  }

  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  }).select("-password -role");
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  } else {
    return res.status(200).json({
      success: true,
      message: "Updated user successfully",
      data: user,
    });
  }
});

module.exports = {
  register,
  login,
  logout,
  getAllUsers,
  getCurrentUser,
  deleteUser,
  updateUser,
  updateUserByAdmin,
};
