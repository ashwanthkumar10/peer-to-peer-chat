import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

// Signup user
export const signup = async (req, res) => {
    const { fullName, phoneNumber, email, password } = req.body;

    try {
        if (!fullName || !phoneNumber || !email || !password) {
            return res.status(400).json({ message: "Please fill all the necessary details" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            phoneNumber,
            email,
            password: hashedPassword
        });

        await newUser.save(); // Save the new user

        // Generate JWT token
        await generateToken(newUser._id, res);

        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            phoneNumber: newUser.phoneNumber,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

    } catch (error) {
        console.error("Error in signup controller:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Login user
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        // If user does not exist
        if (!user) {
            return res.status(400).json({ message: "Invalid User Credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        // If password is incorrect
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid User Credentials" });
        }

        // Generate token
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error in login Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Logout user
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out Successfully" });
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update profile picture
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        // Upload profile picture
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        // Update user's profile pic
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Check authentication
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};