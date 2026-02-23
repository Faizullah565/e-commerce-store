


import mongoose, { Schema } from "mongoose";
const productSchema = new mongoose.Schema({
    userId: {
        // Reference to the User collection
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
      type: String, // Cloudinary secure url
      default: "",
    },
    
    date: {
        type: Date,
        default: Date.now,
    },

}, {
    timestamps: true
}
)

const Products = mongoose.model("Products", productSchema)
export default Products