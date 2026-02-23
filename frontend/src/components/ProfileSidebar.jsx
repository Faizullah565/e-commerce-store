import { Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/baseUrlApi";

// ========= LOGIN USER PROFILE SIDEBAR =================
const ProfileSidebar = () => {
  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    color: "#333",
    textDecoration: "none",
  };
  const {logout, token} = useAuth()
  // ========== HANDLE USER LOGOUT ==================
  const handleLogout = async () => {
    try {
        const response = await api.post(
          "/users/logout",
          {},
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json"
            }
          }
        );
        logout()
      } catch (err) {
        console.error(err);
      }
    };
  return (
    <Box
      p={2}
      sx={{ borderRight: "1px solid #ddd",
        width:{
          md:"20%",
          sm:"30%",
          xs:"100%"
        },  
      }}
    >
      <Typography variant="h6" mb={2} fontWeight="bold">
        My Account
      </Typography>
      <NavLink to="/profile" style={linkStyle}>
        <i className="fa-solid fa-user"></i>
        Profile
      </NavLink>
      <NavLink to="/profile/orders" style={linkStyle}>
        <i className="fa-solid fa-box"></i>
        My Orders
      </NavLink>
      <NavLink to="/profile/add-product" style={linkStyle}>
        <i className="fa-solid fa-box-open"></i>
        Product-Listing
      </NavLink>
      <NavLink to="/profile/fetch-my-products" style={linkStyle}>
        <i className="fa-solid fa-bag-shopping"></i>
        My-Products
      </NavLink>
      <NavLink to="/profile/settings" style={linkStyle}>
        <i className="fa-solid fa-gear"></i>
        Settings
      </NavLink>
      <NavLink to="/login" style={linkStyle} onClick={handleLogout}>
        <i className="fa-solid fa-right-from-bracket"></i>
        Logout
      </NavLink>
    </Box>
  );
};

export default ProfileSidebar;