
import express from 'express'
import fetchUser from '../middleware/fetchUser.js'
import { 
    createProduct,
    deleteProduct,
    editProduct,
    fetchProducts,
    fetchUserProducts,
} from '../controllers/product.controller.js'
import upload from '../middleware/upload.js'

const router = express.Router()
router.get("/", fetchProducts)
router.use(fetchUser)
router.post("/add-product", upload.single("image"), createProduct)
router.get("/fetch-my-products", fetchUserProducts)
router.put("/edit-product/:_id", upload.single("image"), editProduct)
router.delete("/:id", deleteProduct)



export default router