import { Router } from 'express';
import {
    changePassword,
    forgotPasswordController,
    loginUserController,
    logoutUserController,
    refreshToken,
    registerUserController,
    removeImageFromCloudinary,
    resetPassword,
    updateUserDeteils,
    userAvatarController,
    userDetails,
    verifyEmailController,
    verifyforgotPasswordController
} from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const userRouter = Router();
userRouter.post('/register', registerUserController);
userRouter.post('/verify', verifyEmailController);
userRouter.post('/login', loginUserController);
userRouter.get('/logout', auth, logoutUserController);
userRouter.put('/user-avatar', auth, upload.array('avatar'), userAvatarController);
userRouter.delete('/removeImage', auth, removeImageFromCloudinary);
userRouter.put('/:id', auth, updateUserDeteils);
userRouter.post('/forgot-password', forgotPasswordController);
userRouter.post('/verify-forgot-password-otp', verifyforgotPasswordController);
userRouter.post('/change-password', changePassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/refresh-token', refreshToken);
userRouter.get('/user-details', auth, userDetails);


export default userRouter;