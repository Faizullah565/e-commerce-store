import {
    Box,
    Typography,
    Button,
    IconButton,
    Card,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../utils/baseUrlApi";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
    const {
        cart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
    } = useCart();
    const { token } = useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        if (cart.length === 0) navigate("/cart");
    }, [cart, navigate]);
    const itemsPrice = cart?.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const taxPrice = itemsPrice * 0.05;
    const shippingPrice = itemsPrice > 50000 ? 0 : 500;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("");

    // ========== CONFIRM ORDER ==================================
    const confirmOrderHandler = async () => {
        if (
            !address.fullName ||
            !address.phone ||
            !address.address ||
            !address.city ||
            !address.country ||
            !paymentMethod
        ) {
            toast.error("Please fill all required fields");
            return;
        }
        const orderData = {
            orderItems: cart.map(item => ({
                productId: item._id,
                title: item.title,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
            })),
            shippingAddress: address,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        };
        await api.post(
            "/order/confirm-order",
            orderData,
            {
                headers: {
                    Authorization: `${token}`,
                },
            }
        )
        clearCart();
        navigate("/products");
    };
    return (
        <Box p={2}>
            <Typography variant="h4" fontWeight="bold" mb={0}>
                Checkout
            </Typography>
            <Box
            sx={{
                display:"flex",
                gap:"10px",
                flexWrap:"wrap",
                
            }}
            >
                <Box flex={2}>
                    {cart.map(item => (
                        <Card
                            key={item._id}
                            sx={{ display: "flex", alignItems: "center", p: 2, mb: 2 }}
                        >
                            <img src={item.image} width="80" alt={item.title} />
                            <Box flex={1} ml={2}>
                                <Typography fontWeight="bold">{item.title}</Typography>
                                <Typography>Rs {item.price}</Typography>
                                <Box display="flex" alignItems="center">
                                    <IconButton onClick={() => decreaseQuantity(item._id)}>
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography>{item.quantity}</Typography>
                                    <IconButton onClick={() => increaseQuantity(item._id)}>
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Typography fontWeight="bold">
                                Rs {item.price * item.quantity}
                            </Typography>
                            <IconButton onClick={() => removeFromCart(item._id)}>
                                <DeleteIcon color="error" />
                            </IconButton>
                        </Card>
                    ))}
                </Box>
                {/* ================== SHIPPING ARRDESS DETAILS ===================== */}
                <Box flex={1}>
                    <Typography variant="h6" mb={1} textAlign="center">
                        Shipping Address
                    </Typography>

                    <TextField size="small" fullWidth label="Full Name" sx={{ mb: 1 }}
                        onChange={e => setAddress({ ...address, fullName: e.target.value })}
                    />
                    <TextField size="small" fullWidth label="Phone" sx={{ mb: 1 }}
                        onChange={e => setAddress({ ...address, phone: e.target.value })}
                    />
                    <TextField size="small" fullWidth label="Address" sx={{ mb: 1 }}
                        onChange={e => setAddress({ ...address, address: e.target.value })}
                    />
                    <TextField size="small" fullWidth label="City" sx={{ mb: 1 }}
                        onChange={e => setAddress({ ...address, city: e.target.value })}
                    />
                    <TextField size="small" fullWidth label="Postal Code" sx={{ mb: 1 }}
                        onChange={e => setAddress({ ...address, postalCode: e.target.value })}
                    />
                    <TextField size="small" fullWidth label="Country" sx={{ mb: 1 }}
                        onChange={e => setAddress({ ...address, country: e.target.value })}
                    />
                    <FormControl size="small" fullWidth sx={{ mt: 1 }}>
                        <InputLabel>Payment Method</InputLabel>
                        <Select
                            value={paymentMethod}
                            label="Payment Method"
                            onChange={e => setPaymentMethod(e.target.value)}
                        >
                            <MenuItem value="COD">Cash on Delivery</MenuItem>
                            <MenuItem value="EasyPaisa">EasyPaisa</MenuItem>
                            <MenuItem value="JazzCash">JazzCash</MenuItem>
                        </Select>
                    </FormControl>
                    <Divider sx={{ my: 1 }} />
                    <Typography>Items: Rs {itemsPrice}</Typography>
                    <Typography>Tax: Rs {taxPrice}</Typography>
                    <Typography>Shipping: Rs {shippingPrice}</Typography>
                    <Typography fontWeight="bold" mt={1}>
                        Total: Rs {totalPrice}
                    </Typography>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 1, py: 1 }}
                        onClick={confirmOrderHandler}
                    >
                        Confirm Order
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Checkout;