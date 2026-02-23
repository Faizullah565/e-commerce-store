// ================IMPORT YUP FOR VALIDATION ====================
import * as Yup from 'yup'

// ============== CREATE A SIGNUP SCHEMA ====================
export const signupSchema = Yup.object({
    name: Yup.string().min(2).max(30).required("Please enter your name"),
    email: Yup.string().email().required("Please enter a valid email"),
    password: Yup.string().min(8).matches(
        /^(?=.*[A-Z]).{8,}$/,
        { message: <span>Password must be at least 1 uppercase letter</span> }
    ).matches(
        /^(?=.*[a-z])/,
        { message: <span>Must be at least 1 lowercase letter</span> }
    ).matches(
        /^(?=.*\d).{8,}$/,
        { message: <span>At least one number</span> }
    ).matches(
        /^(?=.*[@$!%*#?&]).{8,}$/,
        { message: <span>Must have a special character</span> }
    ).required("Please enter password"),
    confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), null, "Password must match"])
        .required("Password must match")
})

// =================== CREATE A LOGIN SCHEMA ======================
export const loginSchema = Yup.object({
    email: Yup.string().email().required("Please enter a valid email"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/,
            "Password must contain uppercase, lowercase, number & special character"
        )
        .required("Please enter password")
})

// ================RESET PASSWORD SCHEMA =================
export const resetPasswordSchema = Yup.object({
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/,
            "Password must contain uppercase, lowercase, number & special character"
        )
        .required("Please enter password"),
    confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), null, "Password must match"])
        .required("Password must match")
})