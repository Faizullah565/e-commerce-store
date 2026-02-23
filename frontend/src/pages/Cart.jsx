import { Box, Typography, Button, IconButton, Card, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

const Cart = () => {
    const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
    const navigate = useNavigate()
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const itemsPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
// ======= NAVIGATE TO CHECKOUT PAGE ================
    const handleCheckout = () => {
        navigate("/checkout")
    }
    const taxPrice = itemsPrice * 0.05;
    const shippingPrice = itemsPrice > 50000 ? 0 : 500;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    //=========== HANDLE ITEM FROM CART ======================
    const handleDelete = async () => {
        try {
            removeFromCart(selectedId)
            toast.success("Cart item deleted successfully");
            setOpenDelete(false);
        } catch (error) {
            toast
            toast.error("Delete failed");
        }
    };
    if (cart.length === 0) {
        return (
            <Box textAlign="center" mt={10}>
                <Typography variant="h4">Your cart is empty</Typography>
                <Typography color="text.secondary" mt={1}>
                    Looks like you haven’t added anything yet
                </Typography>
                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    sx={{ mt: 3 }}
                >
                    Start Shopping
                </Button>
            </Box>
        );
    }
    return (
        <Box display="flex" gap={3} p={3}
        flexWrap={"wrap"}
        >
            {/* CART ITEMS */}
            <Box flex={2}>
                <Typography variant="h5" mb={2}>
                    Shopping Cart
                </Typography>
                {cart.map((item) => (
                    <Card
                        key={item._id}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            mb: 2,
                            boxShadow: 3,
                        }}
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            width="90"
                            style={{ borderRadius: 10 }}
                        />

                        <Box flex={1} ml={2}>
                            <Typography fontWeight="bold">{item.title}</Typography>
                            <Typography color="text.secondary">
                                Rs.{" "}{item.price}
                            </Typography>

                            <Box display="flex" alignItems="center" mt={1}>
                                {
                                    item?.quantity > 1 ?
                                        <IconButton onClick={() => decreaseQuantity(item._id)}>
                                            <RemoveIcon />
                                        </IconButton>
                                        :
                                        <IconButton onClick={() => decreaseQuantity(item._id)} disabled>
                                            <RemoveIcon />
                                        </IconButton>
                                }
                                <Typography>{item.quantity}</Typography>
                                <IconButton onClick={() => increaseQuantity(item._id)}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </Box>
                        <Typography fontWeight="bold">
                            Rs.{" "}{item.price * item.quantity}
                        </Typography>
                        <IconButton
                            onClick={() => {
                                setSelectedId(item._id);
                                setOpenDelete(true);
                            }}
                        >
                            <i className="fa fa-trash" aria-hidden="true"
                                style={{ color: "red", fontSize: "20px" }}
                            >                                
                            </i>
                        </IconButton>
                    </Card>
                ))}
            </Box>
            <Box
                flex={1}
                p={3}
                sx={{
                    height: "fit-content",
                    boxShadow: 4,
                    borderRadius: 3,
                }}
            >
                {/* ======= SHOW ORDER SUMMARY ======== */}
                <Typography variant="h6" mb={2}>
                    Order Summary
                </Typography>
                <Box display="flex" justifyContent="space-between">
                    <Typography>Subtotal</Typography>
                    <Typography>Rs.{" "}{itemsPrice}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography>Tax</Typography>
                    <Typography>{taxPrice ? taxPrice : "Free"}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography>Shipping</Typography>
                    <Typography>{shippingPrice ? shippingPrice : "Free"}</Typography>
                </Box>
                <hr />
                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography fontWeight="bold">Total</Typography>
                    <Typography fontWeight="bold">Rs.{" "}{totalPrice}</Typography>
                </Box>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, py: 1.5 }}
                    onClick={handleCheckout}
                >
                    Proceed to Checkout
                </Button>
            </Box>
            <Dialog
                open={openDelete}
                onClose={() => setOpenDelete(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this cart item?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Cart;