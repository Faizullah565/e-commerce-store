import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import '../styles/UserStats.css'
import api from "../utils/baseUrlApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserStats = () => {
  const { token } = useAuth()
  const [summary, setSummary] = useState({});
  const navigate = useNavigate()

  // ========== FETCH ORDER SUMMARY USING AGGREGATE ==================
  useEffect(() => {
    const fetchSummary = async () => {
      if (!token) return
      const { data } = await api.get("/order/summary", {
        headers: {
          Authorization: token
        }
      });
      setSummary(data.data);
    };
    fetchSummary();
  }, [token]);
  // ======== EXTRACT TOTAPPRICE USING REDUCE METHOD =========
  const totalPrice = Array.isArray(summary?.totalRevenue)
    ? summary.totalRevenue.reduce((ac, cv) => ac + cv, 0)
    : summary?.totalRevenue || 0;
  const handleOrder = () => {
    navigate("/profile/orders")
  }
  return (
    <Box className="dashboard-container"
      sx={{
        maxWidth: "99%"

      }}
    >
      <Typography variant="h6" className="dashboard-title">
        My Order Summary
      </Typography>
      <Grid container spacing={2}
        sx={{
          display: "flex",
          justifyContent: "space-evenly"
        }}
      >
        <Grid sx={{
          xs: 12,
          md: 4
        }}>
          <Card className="dashboard-card revenue">
            <CardContent>
              <Typography variant="h6">Total Purchase Cost</Typography>
              <Typography variant="h5">
                Rs.{' '}{totalPrice ? totalPrice : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card className="dashboard-card orders"
            sx={{
              cursor: "pointer"
            }}
            onClick={handleOrder}
          >
            <CardContent>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h5">
                {summary?.totalOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          sx={{
            cursor: "pointer"
          }}
          onClick={handleOrder}
        >
          <Card className="dashboard-card quantity">
            <CardContent>
              <Typography variant="h6">Total Items</Typography>
              <Typography variant="h5">
                {summary?.totalOrderQuantity ? summary.totalOrderQuantity : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserStats