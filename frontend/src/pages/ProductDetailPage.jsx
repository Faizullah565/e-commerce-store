import React, { useState } from 'react';
import { Container, Grid, Typography, Button, Box, TextField,} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useProduct } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// CUSTOM STYLED COMPONENT
const ProductImage = styled('img')({
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
});
// ========== SHOW PRODUCT DETAILS AND ADD-TO-CART FUNCTIONALITY =============
const ProductDetailPage = () => {
    const { productDetails } = useProduct()
    const { detailsToCart } = useCart()
    const { token } = useAuth()
    const [quantity, setQuantity] = useState(productDetails?1:'')
    const navigate = useNavigate();
    if (!productDetails) {
        navigate("/products")
    }
    const handleAddToCart = (productDetails) => {
        if (!token) {
            toast.warning("Please login and get back!")
            navigate("/login")
            return
        }
        if (!productDetails) {
            navigate("/products")
        }
        productDetails.quantity=quantity;
        detailsToCart(productDetails)
        navigate("/cart")
    }
    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
            <Grid container spacing={20}
                justifyContent={"center"}
            >
                {/* Left Column: Image */}
                <Grid sx={{
                    xs: "12",
                    md: "6"
                }} >
                    <ProductImage
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        sx={{
                            width: {
                                xs: "100%",
                                sm: "200px",
                                md: "300px",
                                lg: "400px"
                            },
                            objectFit: "cover"
                        }}
                    />
                </Grid>

                {/* Right Column: Details */}
                <Grid>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        {productDetails?.title}
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                        ${productDetails?.price.toFixed(2)}
                    </Typography>
                    {/* Customizations / Actions */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', my: 3 }}>
                        <TextField
                            type="number"
                            label="Qty"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            size="small"
                            sx={{ width: '80px' }}
                            inputProps={{ min: 1 }}
                        />
                        <Button
                            onClick={() => { handleAddToCart(productDetails) }}
                            variant="contained" size="large" color="primary" sx={{ px: 5 }}>
                            <i className="fa-solid fa-cart-arrow-down"></i>
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductDetailPage;
