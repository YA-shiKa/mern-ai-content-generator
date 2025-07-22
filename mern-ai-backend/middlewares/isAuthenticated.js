const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const User = require('../models/User');

const isAuthenticated = asyncHandler(async (req, res, next) => {
    if (req.cookies.token) {
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

            const user = await User.findById(decoded?.id).select('-password');
            if (!user) {
                console.log("Token valid, but user not found in DB for id:", decoded?.id);
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = user;
            console.log("Authenticated user:", req.user._id, req.user.email);

            return next();
        } catch (err) {
            console.log("JWT verification failed:", err.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.log("No token found in cookies.");
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
});

module.exports = isAuthenticated;
