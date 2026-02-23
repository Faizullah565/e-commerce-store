
import { Box, CircularProgress } from '@mui/material'

const Spinner = () => {
    return (
        <Box component="div">
                <CircularProgress enableTrackSlot size={35} />
        </Box>
    )
}

export default Spinner