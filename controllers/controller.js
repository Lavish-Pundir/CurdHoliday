import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/model.js';

   //  User Registration

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};
  // User Login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All field are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", user: user, token });
  } catch (error) {
    console.error("Login error:", error.message); //  log the real error
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
  // Get All Users

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
    // Get Single User

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
      // Update User

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) updatedUser.name = name;
    if (email) updatedUser.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedUser.password = hashedPassword;
    }
    await updatedUser.save();

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
    // Delete User

export const deletedUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
