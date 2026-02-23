import { useFormik } from "formik"
import { loginSchema } from "../schemas"
import { NavLink, Link as RouterLink, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../utils/baseUrlApi.js"
import { Box, Button, FormHelperText, IconButton, InputAdornment, Link, TextField, Typography } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext.jsx"
import { useState } from "react"

// =============== LOGIN PAGE ==================
const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const initialValues = {
        email: "",
        password: "",
    }
    // ========== HANDLE AND VALIDATE FORM USING YUP AND FORMIK ================
    const { values, handleBlur, handleChange, handleSubmit, touched, errors } = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,
        onSubmit: async (values, action) => {
            try {
                const response = await api.post("/users/login", values);
                const token =
                    response.data.token ||
                    response.data.data?.token;
                if (!token) {
                    throw new Error("Token not found");
                }
                toast.success("Login successful");
                login(response?.data)
                action.resetForm();
                navigate("/");
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    error.message ||
                    "Login failed"
                );
            } finally {
                action.setSubmitting(false);
            }
        }
    })
    return (
        <Box className='container loginContainer'
            sx={{
                width: {
                    xs: "95%",
                    sm: "70%",
                    md: "30%",
                    lg: "25%"
                },
                margin: "auto",
                marginTop: "80px",
                padding: "30px 20px",
                borderRadius: "10px",
                border: "1px solid gray"
            }}
        >
            <Typography variant="h5" component="div"
                sx={{
                    fontWeight: "600",
                    fontSize: "28px",
                    marginBottom: "10px",
                    textAlign: "center"
                }}
                className='mt-4 text-center'
            >Login</Typography>
            <Box onSubmit={handleSubmit}
                component="form"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mx: "auto"
                }}
            >
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    id="email"
                    className='w-100'
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    size="small"
                />
                {
                    errors.email && touched.email ?
                        <FormHelperText sx={{ color: "brown" }}>{errors.email}</FormHelperText>
                        : null
                }
                <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    className='w-100'
                    placeholder="Enter Password"
                    size="small"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {
                    errors.password && touched.password ?
                        <FormHelperText sx={{ color: "brown" }}>{errors.password}</FormHelperText>
                        : null
                }
                <NavLink to="/forgot-password" style={{ color: "blue", textDecoration: "none" }}>
                    <small>Forgot Password</small>
                </NavLink>
                <Box component="p" className='text-center mt-2 mb-1'
                    sx={{ textAlign: "center" }}
                >
                    <Button type="submit" variant="contained" className='btn btn-primary px-3' >Login</Button>
                </Box>
                <Typography
                    sx={{
                        textAlign: "center",
                        marginBottom: "5px"
                    }}
                >
                    You don't have an account?{' '}
                    <Link component={RouterLink} to="/signup" variant="body2"
                        sx={{
                            textDecoration: "none",
                            fontWeight: "bold"
                        }}
                    >
                        Signup
                    </Link>
                </Typography>
            </Box>
        </Box>
    )
}

export default Login