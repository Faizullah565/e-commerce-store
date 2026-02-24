import mongoose from "mongoose";
import Order from "../models/Order.js"
// ============= IMPORT STRIPE =============
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// ================== PLACE NEW ORDER ==========================
export const orderPlace = async (req, res) => {
    try {
        const { id } = req.user
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            paymentResult,
            taxPrice,
            shippingPrice,

        } = req.body
        const itemsPrice = orderItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        const totalPrice = (+itemsPrice) + (+taxPrice) + (+shippingPrice)
        const order = new Order({
            userId: id,
            orderItems,
            shippingAddress,
            paymentMethod,
            paymentResult,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });
        await order.save()
        res.json(order);
    } catch (error) {
        res.status(500).json({error, message:"Internal server error"})
    }
}
// ================== FETCH LOGIN USER ORDERS ========================
export const fetchMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $project: {
                    _id: 1,
                    orderStatus: 1,
                    totalPrice: 1,
                    isPaid: 1,
                    createdAt: 1,
                    orderItems: {
                        title: 1,
                        image: 1,
                        quantity: 1,
                        price: 1,
                    },
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ]);
        return res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
// =============== USE AGGREGATE TO FETCH TOTAL ORDER AND AMOUNT===================
export const totalPriceAndNumberOfOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const summary = await Order.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $unwind: "$orderItems"
            },
            {
                $group: {
                    _id: "$userId",
                    totalRevenue: { $addToSet: "$totalPrice" },
                    totalOrders: { $addToSet: "$_id" },
                    ItemDetails: { $addToSet: "$orderItems" },
                    totalOrderQuantity: { $sum: "$orderItems.quantity" },
                    totalOrderPrice: { $sum: "$orderItems.price" },
                }
            },
            {
                $project: {
                    _id: 0,
                    totalRevenue: 1,
                    totalOrders: { $size: "$totalOrders" },
                    totalOrderQuantity: 1,
                    ItemDetails: {
                        title: 1,
                        price: 1,
                        quantity: 1,
                    },
                    totalOrderPrice: 1
                }
            }
        ])
        res.status(200).json({
            success: true,
            data: summary[0] || {
                totalRevenue: 0,
                totalItems: 0,
                totalOrders: 0
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// ================ PAYMENT STRIPE INTEGRATION =================
export const payment =  async (req, res) => {
  try {
    const { orderId } = req.body;
    // fetch DB order totalPrice to secure payment amount
    const order = await Order.findById(orderId);
    if(order.isPaid){
        return res.status(409).json({message:"Payment already done"})
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalPrice * 100, // paisa
      currency: "pkr",
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ================ MARK CONFIRM PAYMENT PAID ===================
export const markPaid =  async (req, res) => {
   try {
      const { orderId, paymentId } = req.body;
      const order = await Order.findById(orderId);
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
         id: paymentId,
         status: "succeeded",
      };
      order.orderStatus="Processing";
      await order.save();
      res.json({ success: true, message:"Payment Successfully" });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};