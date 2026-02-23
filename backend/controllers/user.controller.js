import User from "../models/User.js"
import { body, validationResult } from "express-validator"
import uploadToCloudinary from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import Token from "../models/Tokens.js"
import transporter from "../utils/nodemailer.js"
import crypto from "crypto";

// ======================CREATE USER CONTROLLER =======================
export const createUser = [
    body("name").not().isEmpty().trim().withMessage("Name must not be empty"),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).isStrongPassword().withMessage('Password must be strong and at least 8 characters'),
    body('confirm_password').notEmpty().isLength({ min: 8 }).isStrongPassword()
        .withMessage('Confirm password must be strong and at least 8 characters')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password confirmation does not match password")
            }
            return true
        }),
    async (req, res) => {
        try {
            const { name, email, password } = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let user = await User.findOne({ email })
            if (user) {
                return res.status(409).json({ success: false, message: "User already exist" })
            }
            //========== Upload to Cloudinary ==================
            const profilePic = req.file;
            let imageUrl = "";
            if (profilePic) {
                imageUrl = await uploadToCloudinary(profilePic.path);
            }
            user = await User.create({
                name: name,
                email: email,
                password: password,
                profilePicture: imageUrl
            })
            // =================TRANSPORTER TO SEND MAIL ======================
            // const info = await transporter.sendMail(mailOption)
            return res.status(201).json({ success: true, message: "User created successfully", user })
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
        }
    }
]
// =========== LOGIN CONTROLLER =================
export const userLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).isStrongPassword().withMessage('Password must be strong and at least 8 characters'),
    async (req, res) => {
        try {
            const { email, password } = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const existUser = await User.findOne({ email })
            if (existUser) {
                const comparePassword = await bcrypt.compare(password, existUser.password)
                if (comparePassword) {
                    let user = {
                        id: existUser._id,
                        name: existUser.name,
                        email: existUser.email,
                        profilePicture: existUser.profilePicture
                    }
                    const JWT_SECRET = process.env.JWT_SECRET
                    const token = jwt.sign({ user }, JWT_SECRET)
                    const data = { user, token }
                    const createToken = new Token({
                        userId: existUser._id,
                        token,
                    })
                    await createToken.save()
                    return res.status(200).json({ success: true, message: "User login successfully", data })
                }
                return res.status(404).json({ success: false, message: "User not found, please login with correct credentials" })
            }
            return res.status(404).json({ success: false, message: "User not found, please login with correct credentials" })
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
        }
    }
]
// ================= LOGOUT CONTROLLER =======================
export const logout = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await Token.deleteMany({ userId })
        if (user) {
            return res.status(200).json({ success: true, message: "Logout success" })
        }
        return res.status(404).json({ success: false, message: "You don't have any token" })
    } catch (error) {
        return res.status(500).json({ error: "internal server error" })
    }
}
// =================== FETCH LOGIN USER DETAILS =============================
export const fetchProfile = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(404).send("User Not Found")
        }
        return res.status(200).json({ message: "profile fetched successfully", user })
    } catch (error) {
        return res.status(404).json({ success: false, message: "User not found, please login and get back" })
    }
}
// ================ UPDATE USER PROFILE ===================
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id
        //=============== Upload to Cloudinary ===================
        const profilePic = req.file;
        let imageUrl = "";
        if (profilePic) {
            imageUrl = await uploadToCloudinary(profilePic.path);
        }
        const existUser = await User.findById(userId)
        if (!existUser) {
            return res.status(404).send("User Not Found")
        }
        const user = await User.findByIdAndUpdate(userId,
            {
                name: req.body.name,
                email: req.body.email,
                profilePicture: imageUrl ? imageUrl : existUser.profilePicture
            }
        ).select("-password")
        let data = await User.findById(userId).select("_id name email profilePicture")
        return res.status(200).json({ message: "profile Updated successfully", data })
    } catch (error) {
        return res.status(404).json({ success: false, message: "Internal server error" })
    }
}
// =============== CHANGE PASSWORD =====================
export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id
        const { currentPassword, newPassword } = req.body
        const existUser = await User.findById(userId)
        if (currentPassword == "" || newPassword == "") {
            return res.status(404).json({ message: "All fields must be required" })
        }
        if (!existUser) {
            return res.status(404).json({ message: "Please login with correct creadentials" })
        }
        const comparePassword = await bcrypt.compare(currentPassword, existUser.password)
        if (!comparePassword) {
            return res.status(404).json({ message: "Current Password doesn't match" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedhPassword = await bcrypt.hash(newPassword, salt);
        const user = await User.findByIdAndUpdate(userId, {
            password: hashedhPassword,
        })
        return res.status(200).json({ message: "Password Updated successfully", user })
    } catch (error) {
        return res.status(404).json({ success: false, message: "Internal server error" })
    }
}

// ============== FORGOT PASSWORD ===============
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required" })
        }
        const user = await User.findOne({ email }).select("-password")
        if (!user) {
            res.status(404).json({ message: "User not found" })
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
        await user.save();
        const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
        const mailOption = {
            from: `"Faizullah Balghari" <${process.env.SMTP_SENDER}>`,
            to: email,
            name: user.name,
            subject: "Reset Password",
            html: `<p>Click below to reset password:</p>
           <a href="${resetURL}">${resetURL}</a>`
        }
        await transporter.sendMail(mailOption)
        res.status(200).json({ message: "Reset email sent" });
    } catch (error) {
        res.status(500).json({ message: "internal server error", error });
    }
}

// ============== RESET PASSWORD ===============
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password, confirm_password} = req.body
        if(password == '' || confirm_password=='' && password !==confirm_password){
            return res.status(400).json({ message: "Password Must be same and not empty" });
        }
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user)
            return res.status(400).json({ message: "Invalid or expired token" });
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        return res.status(500).json({ message: "internal server error", error })
    }
};