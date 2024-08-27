import { catchAsyncErrors } from './catchAsyncError.js';
import ErrorHandler from './error.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/userSchema.js';

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.token; // Access the token from cookies
    if (!token) {
        return next(new ErrorHandler("User not authorized", 400));
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decode.id);
        next();
    } catch (err) {
        return next(new ErrorHandler("User not authorized", 401)); // Unauthorized
    }
});
