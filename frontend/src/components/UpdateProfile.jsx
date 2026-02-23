
import { Avatar, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import api from '../utils/baseUrlApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
//============= UPDATE/ EDIT USER PROFILE ============================================
const UpdateProfile = () => {
    const [profilePicture, setProfilePicture] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const { token, user, setUser, updateProfile } = useAuth()
    const navigate = useNavigate()
    const fetchUser = async () => {
        try {
            const response = await api.get("/users/fetch-profile",
                {
                    headers: {
                        Authorization: localStorage.getItem("auth-token")
                    }
                }
            )
            setUser(response.data?.user)
        } catch (error) {
            toast.error(error)
        }
    }
    useEffect(() => {
        fetchUser()
    }, [])
    useEffect(() => {
        setName(user?.name)
        setEmail(user?.email)
    }, [user])
    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };
    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        if (profilePicture) {
            formData.append("profilePicture", profilePicture);
        }
        try {
            const response = await api.put("/users/update-profile",
                formData,
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            updateProfile(response?.data)
            toast.success("Profile Updated Successfully");
            navigate("/profile")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };
    return (
        <Box sx={
            {
                width: {
                    xs: "90% ",
                    sm: "70%",
                    md: "40%",
                    lg: "35%"
                },
                padding: "20px",
                border: "1px solid gray",
                borderRadius: "10px",
                marginTop: "20px"
            }
        }>
            <form onSubmit={handleSubmit}>
                <Typography variant='h5' textAlign={"center"} mb={2} >Update Profile</Typography>
                <Stack spacing={2} alignItems="center">
                    <Avatar src={user?.profilePicture} sx={{ width: 100, height: 100 }} />
                    <TextField
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        name="name"
                        label="Name"
                        fullWidth
                        size='small'
                    />
                    <TextField
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        label="Email"
                        fullWidth
                        size='small'
                    />
                    {/* USER PROFILE FILE HANDLING */}
                    <TextField
                        type='file'
                        size='small'
                        fullWidth
                        onChange={handleFileChange}
                    />
                    <Button type="submit" variant="contained">
                        <i className="fas fa-save" style={{
                            fontSize:"15px",
                            marginRight:"5px"
                        }}></i>
                        Save Changes</Button>
                </Stack>
            </form>
        </Box>
    );
}

export default UpdateProfile