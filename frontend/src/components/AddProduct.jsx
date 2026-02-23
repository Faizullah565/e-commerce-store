import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
} from "@mui/material";
import { useState } from "react";
import api from "../utils/baseUrlApi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
//======= list new product ==============
const AddProduct = () => {
    const { token } = useAuth()
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState({
        title: "",
        price: "",
        quantity: "",
        image: null,
    });
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };
    // ======== handle frofile picture ==================
    const handleImageChange = (e) => {
        setProduct({ ...product, image: e.target.files[0] });
    };

    // ========= handle add product ==================
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!product.title || !product.price || !product.quantity || !product.image) {
            toast.warn("All fields are required");
            return;
        }
        const formData = new FormData();
        formData.append("title", product.title);
        formData.append("price", product.price);
        formData.append("quantity", product.quantity);
        formData.append("image", product.image);
        try {
            setLoading(true)
            await api.post("/products/add-product", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: token
                }
            });
            toast.success("Product added successfully");
            setProduct({ title: "", price: "", quantity: "", image: null });
        } catch (error) {
            toast.error("Failed to add product");
        } finally {
            setLoading(false)
        }
    };
    return (
        <Box display="flex" justifyContent="center" mt={6}>
            {/* Responsive layout card */}
            <Card sx={{
                py: 3, px: 2, width: {
                    xs: "90%",
                    sm: "80%",
                    md: "40%",
                    lg: "40%",
                    xl: "30%",

                }
            }}>
                <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                    <i className="fa-solid fa-box-open" style={{ color: "#1976d2" }}></i>
                    Add New Product
                </Typography>
                {/*Add product submit handler form */}
                <form onSubmit={submitHandler}>
                    <TextField
                        label="Product Title"
                        name="title"
                        size="small"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={product.title}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Price (Rs)"
                        name="price"
                        type="number"
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                        value={product.price}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Quantity"
                        name="quantity"
                        type="number"
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                        value={product.quantity}
                        onChange={handleChange}
                    />
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        Upload Image
                        <input type="file" hidden onChange={handleImageChange} />
                    </Button>
                    {!loading &&
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ py: 1 }}
                        >
                            Add Product
                        </Button>
                    }
                </form>
                {loading && <Typography textAlign={"center"} mt={2} >
                    <Spinner />
                </Typography>}
            </Card>
        </Box>
    );
};

export default AddProduct;