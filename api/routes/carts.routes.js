
import express from 'express'
import fetchUser from '../middleware/fetchUser.js'
import { addAndUpdateCart, getUserCarts } from '../controllers/cart.controller.js'

const router = express.Router()
router.use(fetchUser)
router.put("/add-update-sync", addAndUpdateCart)
router.get("/", getUserCarts)

export default router