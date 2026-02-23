import User from "../models/User.js"
import { body, validationResult } from "express-validator"
import uploadToCloudinary from "../utils/cloudinary.js"
import Products from "../models/Product.js"
import Order from "../models/Order.js"
import mongoose from "mongoose"
// ================ CREATE/ADD PRODUCT ========================
export const createProduct = [
    body("title").not().isEmpty().isLength({ min: 2 }).trim().withMessage("Title must not be empty"),
    body('quantity').isNumeric().not().isEmpty().trim().withMessage('Quantity must not be empty'),
    body("price").isNumeric().not().isEmpty().trim().withMessage("Price must not empty"),
    async (req, res) => {
        try {
            const { id } = req.user
            const { title, quantity, price } = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            //========= Upload image to Cloudinary =================
            const productPic = req.file;
            let imageUrl = "";
            if (productPic) {
                imageUrl = await uploadToCloudinary(productPic.path);
            }
            const createProduct = await Products.create({
                title,
                price: price / quantity,
                quantity: quantity,
                image: imageUrl,
                userId: id
            })
            return res.status(201).json({ success: true, message: "Product added successfully", product: createProduct })
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
        }
    }
]
//=============== FETCH ALL PRODUCTS ==========================
export const fetchProducts = async (req, res) => {
    try {
        const products = await Products.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({message:"internal server error", success:false})
    }
}
//=============== FETCH LOGIN USER PRODUCTS ==========================
export const fetchUserProducts=async(req, res)=>{
    try {
        const userId = req.user.id
        const products = await Products.aggregate([
            {
                $match:{
                    userId: new mongoose.Types.ObjectId(userId)
                }
            }
        ])
        return res.status(200).json({success:true, message:"Fetched users products successfully", products})
    } catch (error) {
            return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

// =============== EDIT LOGIN USER PRDUCT =================
export const editProduct = [
    body("title").not().isEmpty().isLength({ min: 2 }).trim().withMessage("Title must not be empty"),
    body('quantity').isNumeric().not().isEmpty().trim().withMessage('Quantity must not be empty'),
    body("price").isNumeric().not().isEmpty().trim().withMessage("Price must not empty"),
    async (req, res) => {
        try {
            const { _id } = req.params
            const { title, quantity, price } = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            //=============== Upload to Cloudinary ==================
            const productPic = req.file;
            let imageUrl = "";
            if (productPic) {
                imageUrl = await uploadToCloudinary(productPic.path);
            }
            const editProduct = await Products.findByIdAndUpdate(
                _id,
                {
                title,
                price: price / quantity,
                quantity: quantity,
                image: imageUrl,
            })
            return res.status(201).json({ success: true, message: "Product edited successfully", product: editProduct })
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal Server Error", error })
        }
    }
]
// ================ DELETE USER PRODUCT =============================
export const deleteProduct = async(req, res)=>{
    const {id} = req.params
    try {
        const deleteProductItem = await Products.findByIdAndDelete(id)
        if(!deleteProductItem){
            return res.status(404).json({success:false, message:"Product not found"})
        }
        return res.status(200).json({success:true, message:"Product deleted successfullay"})
    } catch (error) {
        return res.status(500).json({success:false, message:"Internal server error", error})
    }
}