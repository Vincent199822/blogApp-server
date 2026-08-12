const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register User
module.exports.registerUser = async (req, res) => {
    try {

        const { email, username, password, confirmPassword } = req.body;

        // Validate required fields
        if (!email || !username || !password || !confirmPassword) {
            return res.status(400).send({
                message: "All fields are required"
            });
        }

                // confirm-Password
        if (password !== confirmPassword) {
		    return res.status(400).send({
		        message: "Passwords do not match"
		    });
		}


        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).send({
                message: "Email already exists"
            });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
            return res.status(409).send({
                message: "Username already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            email,
            username,
            password: hashedPassword
        });

        // Save user
        await newUser.save();

        return res.status(201).send({
            message: "User registered successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).send({
            message: "Internal server error"
        });
    }
};

// Login User
module.exports.loginUser = async (req, res) => {
    try {

        const { login, password } = req.body;

        // Validate required fields
        if (!login || !password) {
            return res.status(400).send({
                message: "Login and password are required"
            });
        }

        // Find user by email OR username
        const user = await User.findOne({
            $or: [
                { email: login },
                { username: login }
            ]
        });

        // User not found
        if (!user) {
            return res.status(401).send({
                message: "Invalid login credentials"
            });
        }

        // Compare password with hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).send({
                message: "Invalid login credentials"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                username: user.username,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "12h"
            }
        );

        return res.status(200).send({
            message: "Login successful",
            access: token
        });

    } catch (error) {

        console.error(error);

        return res.status(500).send({
            message: "Internal server error"
        });
    }
};
