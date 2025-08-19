import { Router } from 'express';
import {
    adminLoginController,
    changePassword,
    deleteMultipleUsersByAdmin,
    deleteUserByAdmin,
    forgotPasswordController,
    getAllUsers,
    getUserById,
    loginUserController,
    logoutUserController,
    refreshToken,
    registerUserController,
    removeImageFromCloudinary,
    resetPassword,
    updateUserByAdmin,
    updateUserDeteils,
    userAvatarController,
    userDetails,
    verifyEmailController,
    verifyforgotPasswordController
} from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import isAdmin from '../middleware/isAdmin.js';
import isStaffOrAdmin from '../middleware/isStaffOrAdmin.js';

const userRouter = Router();

// --- 1. ROUTES XÁC THỰC (Không cần token) ---
userRouter.post('/register', registerUserController);
userRouter.post('/verify', verifyEmailController);
userRouter.post('/login', loginUserController);
userRouter.post('/admin-login', adminLoginController);
userRouter.post('/forgot-password', forgotPasswordController);
userRouter.post('/verify-forgot-password-otp', verifyforgotPasswordController);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/refresh-token', refreshToken);

// --- 2. ROUTES CHO NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP (Cần auth) ---
userRouter.post('/logout', auth, logoutUserController);
userRouter.get('/user-details', auth, userDetails);
userRouter.put('/user-avatar', auth, upload.array('avatar'), userAvatarController);
userRouter.delete('/removeImage', auth, removeImageFromCloudinary);
userRouter.post('/change-password', auth, changePassword);

// Route động đặt sau
userRouter.put('/:id', auth, updateUserDeteils);


// --- 3. ROUTES DÀNH RIÊNG CHO ADMIN (Cần auth và isAdmin) ---
userRouter.get('/all', auth, isStaffOrAdmin, getAllUsers);
userRouter.post('/delete-multiple', auth, isAdmin, deleteMultipleUsersByAdmin);
userRouter.get('/:id', auth, isStaffOrAdmin, getUserById);
userRouter.put('/updateUserByAdmin/:id', auth, isAdmin, updateUserByAdmin);
userRouter.delete('/:id', auth, isAdmin, deleteUserByAdmin);


export default userRouter;