import { Box } from "@mui/material";
import ProfileSidebar from "../components/ProfileSidebar";
import { Outlet } from "react-router-dom";
// ===========USER PROFILE ============================
const UserProfile = () => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "80vh",
        flexWrap: "wrap"
      }}
    >
      {/* ====== SHOW SIDERAR ON LEFT SIDE ========== */}
      <ProfileSidebar />

      {/* ============ SHOW OUTLET ON RIGHT SIDE ================ */}
      <Box flex={1} p={1} >
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserProfile;