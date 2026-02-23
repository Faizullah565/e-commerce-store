import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import api from '../utils/baseUrlApi';
import { toast } from 'react-toastify';
const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmedPassword] = useState('')
    const { token } = useAuth()

    // ===== strong password pattern ==============
    const strongPasswordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
    const passwordTitle = "Min 8 characters, must include at least one uppercase, lowercase, number, and special character (@$!%*?&)";
    const handleSubmit = async (event) => {
        event.preventDefault()
        // Match validation
        if (newPassword !== confirmPassword) {
            toast.error("New Password and Confirm Password do not match");
            return;
        }
        try {
            const response = await api.put("/users/change-password",
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            toast.success("Password Changed Successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmedPassword("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to Change password");
        }
    };
    return (
        <Box sx={{
            width: { xs: "90%", sm: "70%", md: "40%", lg: "35%" },
            margin: "auto",
            padding: "20px",
            border: "1px solid gray",
            borderRadius: "10px",
            marginTop: "20px"
        }}>
            <form onSubmit={handleSubmit}>
                <Typography variant='h5' textAlign={"center"} mb={3}>Change Password</Typography>
                <Stack spacing={2} alignItems="center">
                    <TextField
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        name="current-password"
                        label="Current Password"
                        fullWidth
                        size='small'
                        type='password'
                        required
                        minLength={8}
                    />
                    <TextField
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        name="new-password"
                        label="New Password"
                        fullWidth
                        size='small'
                        type="password"
                        inputProps={{
                            pattern: strongPasswordRegex,
                            title: passwordTitle
                        }}
                        required
                        helperText="Min 8 chars, upper, lower, number, special char"
                    />
                    <TextField
                        value={confirmPassword}
                        onChange={(e) => setConfirmedPassword(e.target.value)}
                        name="confirm-password"
                        label="Confirm Password"
                        fullWidth
                        size='small'
                        type="password"
                        inputProps={{
                            pattern: strongPasswordRegex,
                            title: passwordTitle
                        }}
                        required
                    />
                    <Button type="submit" variant="contained" >
                        <i className="fa-solid fa-key" style={{ marginRight: "5px" }}></i>
                        Change Password
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}

export default ChangePassword;