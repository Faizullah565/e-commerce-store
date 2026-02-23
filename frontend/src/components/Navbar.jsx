import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import api from "../utils/baseUrlApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Button } from "@mui/material";
import "../styles/Navbar.css";

const drawerWidth = 240;
function Navbar() {
  const navigate = useNavigate()
  const { token, logout} = useAuth()
  const { cart } = useCart();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  //============ HANDLE LOGOUT AND DELETE TOKENS ============
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
      navigate("/login")
    } catch (err) {
      console.error(err);
    }
  };
  // ========== MOBILE RESPONSIVE NAVBAR ================
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <Link
          component={RouterLink}
          to="/"
          className="store-logo"
          color="inherit"
        >
          <i className="fa-solid fa-bag-shopping"></i> E-Store
        </Link>
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText>
              <Link
                component={RouterLink}
                to="/products"
                className="nav-link"
                color="inherit"
              >
                <i className="fa-solid fa-bag-shopping"></i> Products
              </Link>
            </ListItemText>
          </ListItemButton>
        </ListItem>
        <Button color="inherit" component={RouterLink} to="/cart">
          Cart
          <i className="fa-solid fa-cart-arrow-down"></i>
          <span style={{
            position: "absolute",
            bottom: "19px",
            right: "15",
            // color: "red",
            fontWeight: "bold",
            fontSize: "17px"
          }}>
            {token ? cart.length : 0}
          </span>
        </Button>
        {token ? (
          <>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText>
                  <Link
                    component={RouterLink}
                    to="/profile"
                    className="nav-link"
                    color="inherit"
                  >
                    <i className="fas fa-user-alt"></i> Profile
                  </Link>
                </ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ textAlign: "center" }}
                onClick={handleLogout}
              >
                <ListItemText>
                  <span className="nav-link">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </span>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </>
        ) : ( 
          <>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText>
                  <Link
                    component={RouterLink}
                    to="/login"
                    className="nav-link"
                    color="inherit"
                  >
                    <i className="fa fa-sign-in"></i> Login
                  </Link>
                </ListItemText>
              </ListItemButton>
            </ListItem>

          </>
        )}
      </List>
    </Box>
  );
  //================= DESKTOP/ LAPTOP RESPONSIVE NAVBAR ============
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <Link
              component={RouterLink}
              to="/"
              className="store-logo"
              color="inherit"
            >
              <i className="fa-solid fa-bag-shopping"></i> E-Store
            </Link>
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Link
              component={RouterLink}
              to="/products"
              className="nav-link"
              color="inherit"
            >
              <i className="fa-solid fa-bag-shopping"></i> Products
            </Link>
            <Button color="inherit" component={RouterLink} to="/cart">
              Cart
              <i className="fa-solid fa-cart-arrow-down"></i>
              <span style={{
                position: "absolute",
                bottom: "19px",
                right: "15",
                color: "red",
                fontWeight: "bold",
                fontSize: "17px"
              }}>
                {token ? cart.length : 0}
              </span>
            </Button>
            {token ? (
              <>
                <Link
                  component={RouterLink}
                  to="/profile"
                  className="nav-link"
                  color="inherit"
                >
                  <i className="fas fa-user-alt"></i> Profile
                </Link>
                <span className="nav-link" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </span>
              </>
            ) : (
              <>
                <Link
                  component={RouterLink}
                  to="/login"
                  className="nav-link"
                  color="inherit"
                >
                  <i className="fa fa-sign-in"></i> Login
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth
            }
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
Navbar.propTypes = {
  token: PropTypes.string,
  setToken: PropTypes.func
};
export default Navbar;