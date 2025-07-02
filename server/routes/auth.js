const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user });
});

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user", // Default role is "user"
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Test route to verify auth routes are working
router.get("/test", (req, res) => {
    res.json({ message: "Auth routes are working!" });
});

// Logout route (mainly for consistency, logout is handled client-side)
router.post("/logout", auth(), (req, res) => {
    // In a real app, you might want to blacklist the token or store logout info
    res.json({ message: "Logged out successfully" });
});

// Get all users (admin only)
router.get("/users", auth(), async (req, res) => {
    try {
        // Check if user is admin
        const requestingUser = await User.findById(req.user.id);
        if (requestingUser.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const users = await User.find({}, '-password'); // Exclude password from response
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Delete user (admin only)
router.delete("/users/:id", auth(), async (req, res) => {
    try {
        // Check if user is admin
        const requestingUser = await User.findById(req.user.id);
        if (requestingUser.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        // Prevent admin from deleting themselves
        if (req.params.id === req.user.id) {
            return res.status(400).json({ message: "Cannot delete your own account" });
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update user (admin only)
router.put("/users/:id", auth(), async (req, res) => {
    try {
        // Check if user is admin
        const requestingUser = await User.findById(req.user.id);
        if (requestingUser.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const { name, email, role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true, select: '-password' }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;