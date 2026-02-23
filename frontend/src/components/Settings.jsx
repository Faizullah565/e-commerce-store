import { Box, Typography } from '@mui/material'
import UpdateProfile from './UpdateProfile'
import ChangePassword from './ChangePassword'
const Settings = () => {
    return (
        <Box
            sx={{
                padding: "20px "
            }}
        >
            <Typography variant='h5' color='inherit' fontWeight={"600"}>
                Settings
            </Typography>
            <Box display="flex" justifyContent={"space-around"} flexWrap={"wrap"} gap={1}>
                <UpdateProfile />
                <ChangePassword />
            </Box>
        </Box>
    )
}
export default Settings