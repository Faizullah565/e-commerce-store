
import express from 'express'
import {
    createUser,
    fetchProfile,
    logout,
    updateProfile,
    userLogin,
    changePassword,
    forgotPassword,
    resetPassword,
} from '../controllers/user.controller.js'
import fetchUser from '../middleware/fetchUser.js'
import upload from '../middleware/upload.js'
// ================== CREATE ROUTES AND IMPORT CONTROLLERS =======================
const router = express.Router()

router.post("/register", upload.single("profilePicture"), createUser)
router.post("/login", userLogin)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

// Protected routes
// router.use(fetchUser)
router.post("/logout", fetchUser, logout)
router.get("/fetch-profile", fetchProfile)
router.put("/update-profile", upload.single("profilePicture"), updateProfile)
router.put("/change-password", changePassword)

export default router