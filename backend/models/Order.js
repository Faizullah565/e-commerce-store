

import mongoose, { Schema } from 'mongoose'

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    title: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
})

const orderSchema = new mongoose.Schema({
    userId: {
        // Reference to the User collection
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
        fullName: String,
        phone: Number,
        address: String,
        city: String,
        postalCode: String,
        country: String
    },
    paymentMethod: {
        type: String,
        enum: ["Card", "JazzCash", "EasyPaisa"],
        required: true
    },
    paymentResult: {
        id: String,
        status: String,
    },
    itemsPrice: Number,
    taxPrice: Number,
    shippingPrice: Number,
    totalPrice: Number,
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    orderStatus:{
        type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    },
   
    deliveredAt: {
        type: Date,
    },

    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
})

const Order = mongoose.model("Order", orderSchema)
export default Order