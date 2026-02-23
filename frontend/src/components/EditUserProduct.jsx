import { Box, Button, Card, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useProduct } from '../context/ProductContext'
import Spinner from './Spinner'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import api from '../utils/baseUrlApi'
import { useNavigate } from 'react-router-dom'
// ========= EDIT LOGIN USERS PRODUCT ====================
const EditUserProduct = () => {
    const { toUpdateProduct, setFetchedProducts } = useProduct()
    const { token } = useAuth()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [product, setProduct] = useState({
        title: toUpdateProduct ? toUpdateProduct.title : "",
        price: toUpdateProduct ? toUpdateProduct.price * toUpdateProduct.quantity : "",
        quantity: toUpdateProduct ? toUpdateProduct.quantity : "",
        image: null,
    });
    if (!toUpdateProduct) {
        navigate("/profile/fetch-my-products")
        return
    }
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };
    const handleImageChange = (e) => {
        setProduct({ ...product, image: e.target.files[0] });
    };
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
            if (!toUpdateProduct._id) {
                toast.warn("Please select a product!")
                navigate("/profile/fetch-my-products")
                return
            }
            const { data } = await api.put(`/products/edit-product/${toUpdateProduct._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: token
                }
            });
            toast.success("Product edited successfully");
            setProduct({ title: "", price: "", quantity: "", image: null });
            setFetchedProducts(data)
            navigate("/profile/fetch-my-products")
        } catch (error) {
            toast.error("Failed to edit product");
        } finally {
            setLoading(false)
        }
    };
    return (
        <Box>
            <Box display="flex" justifyContent="center" mt={6}>
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
                        <i className='fas fa-edit' style={{ marginRight: "4px" }}></i>
                        Edit Product
                    </Typography>
                    <Box component={"form"} onSubmit={submitHandler}
                        sx={{
                            textAlign: "center"
                        }}
                    >
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
                                sx={{ py: 1 }}
                            >
                                <i className='fas fa-edit' style={{ fontSize: "16px", marginRight: "4px" }}></i>
                                Edit Product
                            </Button>
                        }
                    </Box>
                    {loading && <Typography textAlign={"center"} mt={2} >
                        <Spinner />
                    </Typography>}
                </Card>
            </Box>
        </Box>
    )
}

export default EditUserProduct