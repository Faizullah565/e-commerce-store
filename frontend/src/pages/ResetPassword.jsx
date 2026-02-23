import { useFormik } from "formik";
import { resetPasswordSchema,} from "../schemas";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import Spinner from "../components/Spinner";
import api from "../utils/baseUrlApi";
import LockResetIcon from "@mui/icons-material/LockReset";
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
// =================== RESET PASSWORD COMPONENT WITH THE HELP OF RESET LINK OR TOKEN ===========
const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const initialValues = {
        password: "",
        confirm_password: "",
    };
    // ============ ADD VALIDATION USING FORMIK AND YUP ===========
    const { values, handleBlur, handleChange, handleSubmit, touched, errors } =
        useFormik({
            initialValues,
            validationSchema: resetPasswordSchema,
            onSubmit: async (values, action) => {
                setLoading(true);
                try {
                    await api.post(`/users/reset-password/${token}`, values);
                    toast.success("Password reset successful");
                    action.resetForm();
                    navigate("/login");
                } catch (error) {
                    toast.error(
                        error.response?.data?.message || "Password reset failed"
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
                marginTop: "80px",
                padding: "30px 20px",
                borderRadius: "10px",
                border: "1px solid gray",
            }}
        >
            <Box
                sx={{
                    p: 3,
                    borderRadius: 3,
                    textAlign: "center",
                    justifyContent: "center",
                    display: "flex",
                    verticalAlign: "middle"
                }}
            >
                <LockResetIcon sx={{ fontSize: 35, color: "#ff758c" }} />
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 0.5 }}>
                    Set New Password
                </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                {/* Button */}
                <Typography component={"div"} sx={{ textAlign: "center", mt: 2 }}>
                    {!loading ? (
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{
                                py: 1.2,
                                borderRadius: 2,
                                background: "linear-gradient(135deg, #ff758c, #ff7eb3)",
                                fontWeight: "bold",
                            }}
                        >
                            Reset Password
                        </Button>
                    ) : (
                        <Spinner />
                    )}
                </Typography>
                {/* Back to forgot Link */}
                <Typography sx={{ textAlign: "center", mt: 1 }}>
                    Go back to and{" "}
                    <Link component={RouterLink} to="/forgot-password" style={{textDecoration:"none"}} fontWeight="bold">
                        Forgot
                    </Link>
                    {" "}again
                </Typography>
            </Box>
        </Box>
    );
};

export default ResetPassword;