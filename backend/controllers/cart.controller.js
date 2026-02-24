import Cart from "../models/Cart.js";
import Products from "../models/Product.js";
// ============= ADD AND UPDATE CART =================
export const addAndUpdateCart = async (req, res) => {
    try {
        const { id } = req.user;
        const { items } = req.body;
        if (!Array.isArray(items)) {
            return res.status(400).json({
                success: false,
                message: "Items must be an array",
            });
        }
        for (const item of items) {
            if (!item.productId || !item.quantity || item.quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Each item must have productId and quantity (min 1)",
                });
            }
            const product = await Products.findById(item.productId).select(
                "price title image"
            );
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${item.productId} not found`,
                });
            }
            item.price = product.price;
        }
        let cart = await Cart.findOne({ userId: id });
        if (!cart) {
            cart = await Cart.create({
                userId: id,
                items,
            });
        }
        else {
            cart.items = items;
            await cart.save();
        }
        cart = await Cart.findById(cart._id).populate({
            path: "items.productId",
            select: "title image",
            model: "Products"
        });
        const formattedItems = cart.items.map((item) => ({
            _id: item.productId._id,
            title: item.productId.title,
            image: item.productId.image,
            quantity: item.quantity,
            price: item.price,
        }));
        return res.status(cart ? 200 : 201).json({
            success: true,
            message: cart ? "Cart updated successfully" : "Cart created successfully",
            cartId: cart._id,
            items: formattedItems,
        });
    } catch (error) {
        console.error("Cart error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
// ============ GET LOGEDIN USER CARTS =================
export const getUserCarts = async (req, res) => {
  try {
    const { id } = req.user;
    const cart = await Cart.findOne({ userId: id }).populate({
      path: "items.productId",
      select: "title image",
      model: "Products",
    });
    // =========IF CART IS NULL ============
    if (!cart) {
      return res.status(200).json({
        success: true,
        cartId: null,
        items: [],
      });
    }
    // SAME FORMAT as addAndUpdateCart DESTRUCTURE
    const formattedItems = cart.items.map((item) => ({
      _id: item.productId._id,
      title: item.productId.title,
      image: item.productId.image,
      quantity: item.quantity,
      price: item.price,
    }));
    return res.status(200).json({
      success: true,
      cartId: cart._id,
      items: formattedItems,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};