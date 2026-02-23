import { useFormik } from "formik";
import { signupSchema } from "../schemas";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import Spinner from "../components/Spinner";
import api from "../utils/baseUrlApi";

import {
  Box,
  Button,
  FormHelperText,
  Link,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// ================== CREATE USER PAGE =======================
const Signup = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  };
  const { values, handleBlur, handleChange, handleSubmit, touched, errors } =
    useFormik({
      initialValues,
      validationSchema: signupSchema,
      onSubmit: async (values, action) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("confirm_password", values.confirm_password);
        if (image) {
          formData.append("profilePicture", image);
        }
        setLoading(true);
        try {
          await api.post("/users/register", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          toast.success("Signup successful 🎉");
          action.resetForm();
          navigate("/login");
        } catch (error) {
          console.log("🚀 ~ Signup ~ error:", error)
          toast.error(
            error.response?.data?.message || "Signup failed"
          );
        } finally {
          setLoading(false);
        }
      },
    });
  return (
    <Box
      sx={{
        width: { xs: "95%", sm: "70%", md: "30%", lg: "28%" },
        margin: "auto",
        marginTop: "20px",
        padding: "30px 20px",
        borderRadius: "10px",
        border: "1px solid gray",
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
      >
        Registration Form
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Name */}
        <TextField
          label="Name"
          size="small"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.name && touched.name && (
          <FormHelperText sx={{ color: "brown" }}>
            {errors.name}
          </FormHelperText>
        )}
        {/* Email */}
        <TextField
          label="Email"
          size="small"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.email && touched.email && (
          <FormHelperText sx={{ color: "brown" }}>
            {errors.email}
          </FormHelperText>
        )}
        {/* Password */}
        <TextField
          label="Password"
          size="small"
          type={showPassword ? "text" : "password"}
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {errors.password && touched.password && (
          <FormHelperText sx={{ color: "brown" }}>
            {errors.password}
          </FormHelperText>
        )}
        {/* Confirm Password */}
        <TextField
          label="Confirm Password"
          size="small"
          type={showConfirmPassword ? "text" : "password"}
          name="confirm_password"
          value={values.confirm_password}
          onChange={handleChange}
          onBlur={handleBlur}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  edge="end"
                >
                  {showConfirmPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {errors.confirm_password && touched.confirm_password && (
          <FormHelperText sx={{ color: "brown" }}>
            {errors.confirm_password}
          </FormHelperText>
        )}
        {/* File Upload/ Profile Picture*/}
        <FormHelperText sx={{ color: "darkcyan" }}>
          Upload Profile Picture:
        </FormHelperText>
        <TextField
          size="small"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        {/* Button */}
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          {!loading ? (
            <Button variant="contained" type="submit">
              Register
            </Button>
          ) : (
            <Spinner />
          )}
        </Typography>
        {/* Login Link */}
        <Typography sx={{ textAlign: "center", mt: 1 }}>
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" fontWeight="bold">
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
export default Signup;