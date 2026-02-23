import { Card, CardMedia, CardContent, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import { useState } from "react";
import api from "../utils/baseUrlApi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
// ========== SHOW ONLY LOGIN USER PRODUCTS =========
const UserProductCard = ({ product, fetchUserProducts }) => {
    const { setToUpdateProduct } = useProduct()
    const { token } = useAuth();
    const navigate = useNavigate();
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    // ========= EDIT PRODUCT ============================
    const handleEdit = (product) => {
        setToUpdateProduct(product)
        navigate("/profile/edit-product")
    }
    // ========= DELETE PRODUCT ==========================
    const handleDelete = async () => {
        try {
            await api.delete(`/products/${selectedId}`,
                {
                    headers:{
                        Authorization:token
                    }
                }
            );
            toast.success("Product deleted successfully");
            setOpenDelete(false);
            fetchUserProducts()
        } catch (error) {
            toast.error("Delete failed");
        }
    };
    return (
        <Card >
            <Box
                sx={{
                    height: "200px",
                    overflow: "hidden",
                }}
            >
                <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover"
                    }}
                />
            </Box>
            <CardContent>
                <Box display={"flex"} justifyContent={"space-between"} px={1}>
                    <Typography fontWeight="600">
                        {product.title}
                    </Typography>
                    <Typography fontWeight="600">
                        Qty:{" "}{product.quantity}
                    </Typography>
                </Box>
                <Typography color="green" px={1}>
                    <b>Rs:</b> {product.price}
                </Typography>
                <Typography 
                sx={{ mt: 1, verticalAlign: "center", display:"flex", justifyContent:"space-between" }}
                >
                    <Button
                        size="small"
                        variant="contained"
                        sx={{
                            width:"10px"
                        }}
                        onClick={() => handleEdit(product)}
                    >
                        <i className='fas fa-edit' style={{ fontSize: "16px", marginRight: "4px" }}></i>
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => {
                            setSelectedId(product._id);
                            setOpenDelete(true);
                        }}
                    >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                    </Button>
                </Typography>
            </CardContent>
            {/* DIALOGBOX TO SHOW WARNING DELETE PRODUCT */}
            <Dialog
                open={openDelete}
                onClose={() => setOpenDelete(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this product?
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
        </Card>
    );
};

export default UserProductCard;