import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useProduct } from "../context/ProductContext";

// ====== PRODUCT CARD ==========================
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const {setProductDetails} = useProduct()
  const navigate = useNavigate();
  const { token } = useAuth()
  const handleAddToCart = (product) => {
    if (!token) {
      toast.warn("Please login")
      navigate("/login")
    }
    else {
      addToCart(product)
    }
  }
  const handleViewDetails = (product)=>{
    setProductDetails(product)
    navigate(`/product/${product._id}`)
  }
  return (
    <Card >
      <Box
      sx={{
        height:"220px",
        overflow:"hidden"
      }}
      >
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
        sx={{
          height:"99%",
          width:"100%",
          objectFit:"cover"
        }}
        />
      </Box>
      <CardContent>
        <Typography fontWeight="600">
          {product.title}
        </Typography>
        <Typography color="green">
          <b>Rs:</b> {product.price}
        </Typography>
        <Typography
          component="div"
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Button
            size="small"
            variant="contained"
            sx={{ mt: 1 }}
            onClick={() => handleViewDetails(product)}
            color="success"
          >
            View
          </Button>
          <Button
            size="small"
            variant="contained"
            sx={{ 
              mt: 1,
              '&:hover': {  // Styles for the hover state
            backgroundColor: '#06055a81', // A slightly darker orange on hover
          }
            }}
            onClick={() => { handleAddToCart(product) }}>
            <i className="fa-solid fa-cart-arrow-down"></i>
          </Button>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;