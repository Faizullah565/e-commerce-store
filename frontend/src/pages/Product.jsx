import { useState } from "react";
import { Box, Grid, Typography, TextField, Button } from "@mui/material";
import ProductCard from "../components/ProductCard";
import { useProduct } from "../context/ProductContext";
const Product = () => {
    // ============== GET PRODUCTS USING CONTEXT API ============
    const {products} = useProduct()
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [nameSearch, setNameSearch] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
// ========== SEARCH FUNCTIONALITY ON THE BASIS OF TITLE AND PRICE ==============
    const handleSearch = () => {
        const result = products.filter((product) => {
            const matchName = product?.title
                ?.toLowerCase()
                .includes(nameSearch.toLowerCase());
            const matchPrice =
                maxPrice === "" || product.price <= Number(maxPrice);
            return matchName && matchPrice;
        });
        if (nameSearch == '' && maxPrice == '') {
            setFilteredProducts([]);
        } else {
            setFilteredProducts(result)
        }
    };
    return (
        <Box
        component={"div"}
        sx={{
            padding:"1px",
            marginBottom:"10px"

        }}
        >
            <Box sx={{ p: 4, height: "100vh", marginBottom:"10px"}}>
                <Typography
                    variant="h4"
                    mb={3}
                    textAlign="center"
                    fontWeight="bold"
                >
                    Products Page
                </Typography>
                <Box p={3}>
                    <Box display="flex" gap={2} mb={3}
                        flexWrap="wrap"
                        justifyContent="center"
                    >
                        <TextField
                            size="small"
                            label="Search by Name"
                            variant="outlined"
                            value={nameSearch}
                            onChange={(e) => setNameSearch(e.target.value)}
                        />
                        <TextField
                            label="Max Price"
                            type="number"
                            size="small"
                            variant="outlined"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            size="small"
                        >
                            Search
                        </Button>
                    </Box>
                </Box>
                {filteredProducts.length>0 && <Typography
                    variant="h5"
                    mb={2}
                    textAlign="center"
                >
                    Search Products
                </Typography>}
                <Grid
                    container
                    spacing={3}
                    sx={{
                        justifyContent: "center",
                        marginBottom:"25px"
                    }}
                >
                    {/* ====== SHOW FILTER PRODUCTS ======== */}
                    {filteredProducts?.length > 0 ? (
                        filteredProducts.map((product) => (
                            <Grid
                                key={product._id}
                                sx={{
                                    width: {
                                        xs: "100%",
                                        sm: "45%",
                                        md: "30%",
                                        lg: "17%"
                                    },
                                    padding: "0px",
                                    margin: "0px"
                                }}
                            >
                                {/* ======= PASS PRODUT AS A PROPS TO THE CARD COMPONENT===== */}
                                <ProductCard product={product} />
                            </Grid>
                        ))
                    ) : ""}
                </Grid>
                <Grid
                    container
                    spacing={3}
                    sx={{
                        justifyContent: "center"
                    }}
                >
                    {products?.length > 0 ? (
                        products.map((product) => (
                            <Grid
                                key={product._id}
                                sx={{
                                    width: {
                                        xs: "100%",
                                        sm: "45%",
                                        md: "30%",
                                        lg: "17%"
                                    },
                                    padding: "0px",
                                    margin: "0px"
                                }}
                            >
                                <ProductCard product={product} />
                            </Grid>
                        ))
                    ) : (
                        <Typography textAlign="center" width="100%">
                            No products found
                        </Typography>
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default Product;