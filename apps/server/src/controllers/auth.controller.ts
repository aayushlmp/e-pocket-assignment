import { Request, Response } from 'express';
import { asyncHandler } from "../utils/async-handler.ts";
import { AppDataSource } from '../db/index.ts';
import { User } from '../entities/User.entity.ts';
import { AuthService } from '../services/auth.service.ts';
import { ApiError } from '../utils/api-error.ts';
import { ApiResponse } from '../utils/api-response.ts';

// Instantiate Service layer manually with the User repository instance
const userRepository = AppDataSource.getRepository(User);
const authService = new AuthService(userRepository);

const signIn = asyncHandler(async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        if(!email || !password) {
            throw new ApiError(400, "Email and password are required")
        }
    } catch (error) {
        
    }
    const loggedInUser = await authService.signIn(email, password);
    const {accessToken, refreshToken} = loggedInUser;
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            loggedInUser,
            "User logged In Successfully"
        )
    )

});
const signOut = asyncHandler((req, res) => {

});

export { signIn, signOut };