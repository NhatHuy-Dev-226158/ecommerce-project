import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmailFun from '../config/sendEmail.js';
import verificationEmail from '../utils/verifyEmailTemplate.js';
import generateAccessToken from '../utils/generateAccessToken.js';
import generateRefreshToken from '../utils/generateRefreshToken.js';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function registerUserController(request, response) {
    try {
        let user;

        const { role, name, email, password, mobile, birthday, gender } = request.body;
        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide email, name, password",
                error: true,
                success: false,
            })
        }

        user = await UserModel.findOne({ email: email });
        if (user) {
            return response.json({
                message: "This email is already registered",
                error: true,
                success: false
            })
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt)
        user = new UserModel({
            name: name,
            email: email,
            password: hashPassword,
            mobile: mobile,
            birthday: birthday,
            gender: gender,
            role: role,
            otp: verifyCode,
            otpExpires: Date.now() + 600000
        });

        await user.save()

        await sendEmailFun(
            email,
            "Verify email from MiniMarket",
            "",
            verificationEmail(name, verifyCode)
        )

        // Create a JWT token for verification purposes
        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JSON_WEB_TOKEN_SECRET_KEY
        );

        return response.status(200).json({
            success: true,
            error: false,
            message: "User registered successfully! Please verify your email.",
            token: token,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function verifyEmailController(request, response) {
    try {
        const { email, otp } = request.body;

        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return response.status(400).json({
                error: true,
                success: false,
                message: "User not found"
            })
        }

        const isCodeValid = user.otp === otp;
        const isNotExpired = user.otpExpires > Date.now();

        if (isCodeValid && isNotExpired) {
            user.verify_email = true;
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return response.status(200).json({ error: false, success: true, message: "Email verified successfully" });
        } else if (!isCodeValid) {
            return response.status(400).json({ error: true, success: false, message: "Invalid OTP" });
        } else {
            return response.status(400).json({ error: true, success: false, message: "OTP expired" });
        }


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function loginUserController(request, response) {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                message: "Please provide both email and password.",
                error: true,
                success: false
            });
        }
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return response.status(404).json({
                message: "User not register",
                error: true,
                success: false
            })
        }
        if (user.status !== "Active") {
            return response.status(403).json({
                message: "Account is not active. Please contact the administrator.",
                error: true,
                success: false
            })
        }
        if (user.verify_email !== true) {
            return response.status(400).json({
                message: "Your email has not been verified. Please check your inbox and verify your account first.",
                error: true,
                success: false
            })
        }

        const checkPassword = await bcryptjs.compare(password, user.password);

        if (!checkPassword) {
            return response.status(400).json({
                message: "Invalid email or password",
                error: true,
                success: false
            })
        }

        const accesstoken = generateAccessToken(user._id);
        const refreshtoken = generateRefreshToken(user._id);

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            last_login_date: new Date()
        })

        // const cookiesOption = {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "None"
        // }
        // response.cookie('accesstoken', accesstoken, cookiesOption);
        // response.cookie('refreshtoken', refreshtoken, cookiesOption);

        return response.json({
            message: "Login successfully",
            error: false,
            success: true,
            accesstoken: accesstoken,
            refreshtoken: refreshtoken,
            // data: {
            //     accesstoken,
            //     refreshtoken
            // }
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function adminLoginController(request, response) {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({ message: "Vui lòng cung cấp email và mật khẩu." });
        }

        const user = await UserModel.findOne({ email: email });

        // 1. Kiểm tra email và mật khẩu
        if (!user || !(await bcryptjs.compare(password, user.password))) {
            return response.status(400).json({ message: "Email hoặc mật khẩu không hợp lệ." });
        }

        // 2. (QUAN TRỌNG) Kiểm tra vai trò
        if (user.role !== 'ADMIN' && user.role !== 'STAFF') {
            return response.status(403).json({ // 403 Forbidden
                message: "Truy cập bị từ chối. Bạn không có quyền đăng nhập vào trang quản trị.",
                error: true,
                success: false
            });
        }

        // 3. Nếu mọi thứ hợp lệ, tạo token và trả về response
        const accesstoken = generateAccessToken(user._id);
        const refreshtoken = generateRefreshToken(user._id);

        user.last_login_date = new Date();
        await user.save();

        const userToReturn = {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
        };

        return response.status(200).json({
            message: "Đăng nhập quản trị thành công",
            error: false,
            success: true,
            data: {
                accesstoken: accesstoken,
                refreshtoken: refreshtoken,
                user: userToReturn
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function logoutUserController(request, response) {
    try {
        const userid = request.userId //auth middleware

        // if (!userid) {
        //     return response.status(401).json({
        //         message: "Unauthorized access.",
        //         error: true,
        //         success: false
        //     });
        // }

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }
        response.clearCookie('accesstoken', cookiesOption);
        response.clearCookie('refreshtoken', cookiesOption);

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
            refresh_token: ""
        })

        return response.json({
            message: "Logout successfully",
            error: false,
            success: true,
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function userAvatarController(request, response) {
    try {
        const userId = request.userId;
        const imageFiles = request.files;

        if (!imageFiles || imageFiles.length === 0) {
            return response.status(400).json({ message: "No avatar file provided." });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        if (user.avatar) {
            const imgUrl = user.avatar;
            const urlArr = imgUrl.split("/");
            const avatar_image = urlArr[urlArr.length - 1];
            const imageName = avatar_image ? avatar_image.split(".")[0] : null;

            if (imageName) {
                await cloudinary.uploader.destroy(imageName);
            }
        }

        const fileToUpload = imageFiles[0];
        const uploadResult = await cloudinary.uploader.upload(fileToUpload.path);

        fs.unlinkSync(fileToUpload.path);
        const newAvatarUrl = uploadResult.secure_url;

        user.avatar = newAvatarUrl;
        await user.save();

        return response.status(200).json({
            message: "Avatar uploaded successfully.",
            success: true,
            _id: userId,
            avatar: newAvatarUrl
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function removeImageFromCloudinary(request, response) {

    // try {
    //     const userId = request.userId;
    //     const user = await UserModel.findById(userId);

    //     if (!user) {
    //         return response.status(404).json({
    //             message: "User not found." 
    //         });
    //     }

    //     const imgUrl = user.avatar;

    //     if (!imgUrl) {
    //         return response.status(400).json({ 
    //             message: "No avatar to delete." 
    //         });
    //     }

    //     const urlArr = imgUrl.split("/");
    //     const imageFile = urlArr[urlArr.length - 1];
    //     const publicId = imageFile.split(".")[0];

    //     await cloudinary.uploader.destroy(publicId);

    //     user.avatar = ""; 
    //     await user.save(); 


    //     return response.status(200).json({
    //         message: "Avatar removed successfully.",
    //         success: true,
    //         error: false
    //     });

    // } catch (error) {
    //     return response.status(500).json({
    //         message: "An internal server error occurred.",
    //         error: true,
    //         success: false
    //     });
    // }


    const imgUrl = request.query.img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];
    const imageName = image.split(".")[0];

    if (imageName) {
        const res = await cloudinary.uploader.destroy(
            imageName,
            (error, result) => {

            }
        );

        if (res) {
            response.status(200).send(res);
        }
    }
}

export async function updateUserDeteils(request, response) {
    try {
        const userId = request.userId //auth middleware
        const { name, email, mobile, password, birthday, gender } = request.body;

        const userExist = await UserModel.findById(userId);
        if (!userExist) {
            return response.status(400).send('The user cannot be Updated!');
        }

        let verifyCode = "";

        if (email !== userExist.email) {
            verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        }

        let hashPassword = "";

        if (password) {
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password, salt)
        } else {
            hashPassword = userExist.password
        }

        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                name: name,
                mobile: mobile,
                email: email,
                birthday: birthday,
                gender: gender,
                verify_email: email !== userExist.email ? false : true,
                password: hashPassword,
                otp: verifyCode !== "" ? verifyCode : null,
                otpExpires: verifyCode !== "" ? Date.now() + 600000 : ""
            },
            { new: true }
        )

        if (email !== userExist.email) {
            await sendEmailFun(
                email,
                "Verify email from MiniMarket",
                "",
                verificationEmail(name, verifyCode)
            )
        }
        return response.json({
            message: "User Updated Successfully",
            error: false,
            success: true,
            user: {
                name: updateUser?.name,
                email: updateUser?.email,
                mobile: updateUser?.mobile,
                avatar: updateUser?.avatar,
                birthday: updateUser?.birthday,
                gender: updateUser?.gender
            }
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body;
        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        } else {
            let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

            user.otp = verifyCode;
            user.otpExpires = Date.now() + 600000;
            await user.save();


            await sendEmailFun(
                email,
                "Verify email from MiniMarket",
                "",
                verificationEmail(user.name, verifyCode)
            )

            return response.status(200).json({
                message: "Check your email",
                error: false,
                success: true
            })
        }

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function verifyforgotPasswordController(request, response) {
    try {
        const { email, otp } = request.body;
        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }
        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide required field email, otp",
                error: true,
                success: false
            })
        }
        if (otp !== user.otp) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            })
        }

        const currentTime = new Date().toISOString()
        if (user.otpExpires < currentTime) {
            return response.status(400).json({
                message: "OTP is expired",
                error: true,
                success: false
            })
        }

        user.otp = "";
        user.otpExpires = "";
        await user.save();

        return response.status(200).json({
            message: "OTP verified successfully. You can now reset your password.",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function changePassword(request, response) {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = request.body;
        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                error: true,
                success: false,
                message: "provide required fields email, newPassword, confirmPassword"
            })
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            })
        }

        const checkPassword = await bcryptjs.compare(oldPassword, user.password);

        if (!checkPassword) {
            return response.status(400).json({
                message: "Mật khẩu hiện tại không chính xác",
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "Mật khẩu mới và mật khẩu xác nhận không khớp",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(confirmPassword, salt)

        user.password = hashPassword;
        await user.save();

        return response.status(200).json({
            message: "Password updated successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function resetPassword(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body;
        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                error: true,
                success: false,
                message: "provide required fields email, newPassword, confirmPassword"
            })
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "Mật khẩu mới và mật khẩu xác nhận không khớp",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(confirmPassword, salt)

        user.password = hashPassword;
        await user.save();

        return response.status(200).json({
            message: "Password updated successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function refreshToken(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]
        if (refreshToken) {
            return response.status(400).json({
                message: "Invalid token",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)
        if (!verifyToken) {
            return response.status(400).json({
                message: "Token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken?._id;
        const newAccessToken = await generateAccessToken(userId)

        response.cookie('accessToken', newAccessToken, cookiesOption)

        return response.json({
            message: "New access token generated",
            error: true,
            success: false,
            date: {
                accessToken: newAccessToken
            }
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function userDetails(request, response) {
    try {
        const userId = request.userId
        const user = await UserModel.findById(userId).select('-password -refresh-token')

        return response.json({
            message: 'User detail',
            data: user,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getAllUsers = async (request, response) => {
    try {
        const page = parseInt(request.query.page, 10) || 1;
        const limit = parseInt(request.query.limit, 10) || 10;
        const searchTerm = request.query.search || '';
        const skip = (page - 1) * limit;

        const filter = {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ]
        };

        const users = await UserModel.find(filter)
            .select('-password -refresh_token -otp -otpExpires')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalUsers = await UserModel.countDocuments(filter);

        return response.status(200).json({
            success: true,
            data: users,
            totalPages: Math.ceil(totalUsers / limit),
            totalCount: totalUsers
        });
    } catch (error) {
        return response.status(500).json({ success: false, message: error.message });
    }
};

export const getUserById = async (request, response) => {
    try {
        const userId = request.params.id;
        if (!mongoose.isValidObjectId(userId)) {
            return response.status(400).json({ success: false, message: 'Invalid User ID' });
        }

        const user = await UserModel.findById(userId).select('-password -refresh_token');

        if (!user) {
            return response.status(404).json({ success: false, message: 'User not found' });
        }

        return response.status(200).json({ success: true, data: user });
    } catch (error) {
        return response.status(500).json({ success: false, message: error.message });
    }
};

export const updateUserByAdmin = async (request, response) => {
    try {
        const userId = request.params.id;
        const { name, role, status } = request.body; // Các trường admin có thể sửa

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { name: name, role: role, status: status },
            { new: true }
        ).select('-password -refresh_token');

        if (!updatedUser) {
            return response.status(404).json({ success: false, message: "User not found." });
        }

        return response.status(200).json({
            success: true,
            message: "User updated successfully.",
            data: updatedUser
        });
    } catch (error) {
        return response.status(500).json({ success: false, message: error.message });
    }
};