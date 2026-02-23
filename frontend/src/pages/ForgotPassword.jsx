import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import api from "../utils/baseUrlApi";
import { toast } from "react-toastify";
// =================== FORGOT PASSWORD ==============================
const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  // ================ HANDLE FORGOT PASSWORD USING EMAIL ===================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/forgot-password", { email });
      toast.success("Reset link sent to your email");
    } catch (error) {
      toast.error("Email not found");
    }
  };
  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 5,
          width: 400,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <MailOutlineIcon sx={{ fontSize: 40, color: "#667eea" }} />
        <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
          Forgot Password?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your email and we’ll send you a reset link
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            fullWidth
            size="small"
            sx={{ mb: 3 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              py: 1.2,
              borderRadius: 2,
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              fontWeight: "bold",
            }}
          >
            Send Reset Link
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;