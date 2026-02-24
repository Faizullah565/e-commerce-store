
import express from 'express'
import fetchUser from '../middleware/fetchUser.js'
import { 
    fetchMyOrders,
    markPaid, 
    orderPlace, 
    payment, 
    totalPriceAndNumberOfOrders,
    
} from '../controllers/order.controller.js'

const router = express.Router()
router.use(fetchUser)
router.post("/confirm-order", orderPlace)
router.get("/fetch-my-orders", fetchMyOrders)
router.get("/summary", totalPriceAndNumberOfOrders)
router.post("/create-payment-intent", payment)
router.put("/mark-paid", markPaid)

export default router