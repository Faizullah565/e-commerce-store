import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";

// ===== HERO SECTION ======================
const Hero = () => {
  const { user, token } = useAuth()
  const { setFetchedCarts } = useCart()
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) return
    setFetchedCarts(token)
  }, []);
  return (
    <Box
      sx={{
        height: { xs: "70vh", md: "90vh" },
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/banner.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        textAlign: "center",
        px: 2
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 1,
            fontSize: { xs: "20px", md: "40px" }
          }}
        >
          Welcome {user ? user?.name : "to Our Store"}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 1,
            fontSize: { xs: "20px", md: "40px" }
          }}
        >
          Shop Smarter, Live Better
        </Typography>
        <Typography
          sx={{
            mb: 3,
            fontSize: { xs: "14px", md: "18px" },
            color: "#ddd"
          }}
        >
          Discover premium products at unbeatable prices
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            px: 4,
            py: 1.2,
            fontSize: "16px"
          }}
          onClick={() => navigate("/products")}
        >
          Shop Now
        </Button>
      </Box>
    </Box>
  );
};

export default Hero;