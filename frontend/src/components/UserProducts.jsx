import { Box, Grid, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../utils/baseUrlApi'
import UserProductCard from './UserProductCard'

// =========== FETCH LOGIN USER PRODUCTS ==============
const UserProducts = () => {
    const { token } = useAuth()
    const [products, setProducts] = useState([])
    const fetchUserProducts = async () => {
        try {
            const response = await api.get("/products/fetch-my-products", {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setProducts(response?.data?.products || [])
        } catch (error) {
            toast.error(error)
        }
    }
    useEffect(() => {
        if (token) fetchUserProducts();
    }, [token]);
    return (
        <Box>
            {/* PRODUCTS */}
            <Box sx={{ p: 2, height: "100vh" }}>
                <Typography variant="h5" fontWeight={"600"} mb={3} ml={3}>
                    My Products
                </Typography>
                <Grid container spacing={3}
                    sx={{
                        justifyContent: "center"
                    }}
                >
                    {products.map(product => (
                        <Grid key={product._id}
                            sx={{
                                width: {
                                    xs: "90%",
                                    sm: "90%",
                                    md: "45%",
                                    lg: "21%",
                                    xl: "20"
                                },
                                padding: "0px",
                                margin: "0px"
                            }}
                        >
                            {/* ======= PASS PRODUCT OBJECT TO THE CARD COMPONENT =========  */}
                            <UserProductCard product={product} fetchUserProducts={fetchUserProducts} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    )
}

export default UserProducts