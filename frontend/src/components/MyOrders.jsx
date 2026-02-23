import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Divider,
    CircularProgress,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import api from "../utils/baseUrlApi";
import "../styles/MyOrder.css";
import { Button } from "@mui/material";
import CheckoutForm from "./CheckoutForm";
import { toast } from "react-toastify";

const MyOrders = () => {

    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState()
    const [openPayment, setOpenPayment] = useState(false);
    
    const fetchMyOrders = async () => {
        try {
            const res = await api.get("/order/fetch-my-orders", {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setOrders(res?.data?.orders || []);
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchMyOrders();
    }, [token]);

    if (loading) {
        return (
            <Box className="center-loader">
                <CircularProgress />
            </Box>
        );
    }
    const handlePayNow = (order) => {
        setOpenPayment(true)
        setData(order)
    }
    return (
        <Box className="orders-page">
            <Typography variant="h4" className="page-title">
                My Orders
            </Typography>
            <CheckoutForm
                data={data}
                setData={setData}
                open={openPayment}
                handleClose={() => setOpenPayment(false)}
            />
            {orders.length === 0 ? (
                <Typography>No orders found</Typography>
            ) : (
                orders.map((order) => (
                    <Card key={order._id} className="order-card">
                        <CardContent>
                            {/* Order Header */}
                            <Box className="order-header" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Typography variant="subtitle1">
                                    Order ID: {order._id.slice(-6)}
                                </Typography>
                                <Chip
                                    label={order.orderStatus}
                                    color={
                                        order.orderStatus === "Delivered"
                                            ? "success"
                                            : "warning"
                                    }
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent:"space-between", gap: 2 }}>
                            <Typography className="order-date">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography>

                            {!order.isPaid && (
                                <Button
                                        variant="contained"
                                        size="small"
                                        color="success"
                                        onClick={() => handlePayNow(order)}
                                        sx={{
                                            borderRadius:"20px",
                                            marginTop:"10px",
                                            fontSize:"12px",
                                            marginLeft:"5px"
                                        }}
                                        >
                                        Pay Now
                                    </Button>
                                )}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Order Items spreaded */}
                            <Box sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0px 30px",
                            }}
                            >
                                {order.orderItems.map((item, i) => (
                                    <Box key={i} className="order-item">
                                        <img src={item.image} alt={item.title} />
                                        <Box>
                                            <Typography className="item-title">
                                                {item.title}
                                            </Typography>
                                            <Typography className="item-meta">
                                                Qty: {item.quantity} | Rs {item.price}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Footer */}
                            <Box className="order-footer">
                                <Typography>
                                    <strong>Total:</strong> Rs {order.totalPrice}
                                </Typography>
                                <Chip
                                    label={order.isPaid ? "Paid" : "Unpaid"}
                                    color={order.isPaid ? "success" : "error"}
                                    size="small"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
};

export default MyOrders;