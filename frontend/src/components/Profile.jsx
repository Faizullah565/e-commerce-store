import { Box, Typography, Card, Avatar, Stack } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import UserStats from "./UserStats";
const stringToInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
const stringToColor = (string = "") => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 45%)`;
};
// =========== LOGIN USER PROFILE PAGE ================ 
const Profile = () => {
  const { user } = useAuth();
  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Profile Details
      </Typography>
      <Box sx={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap"
      }}>
        <Card sx={{ p: 3, minWidth: 250 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            {/* IF USER IMAGE NOT FOUND THEN CREATE AN AVATAR */}
            <Avatar
              src={user?.profilePicture || ""}
              alt={user?.name}
              sx={{
                width: 70,
                height: 70,
                fontSize: 28,
                fontWeight: "bold",
                bgcolor: user?.profilePicture
                  ? "transparent"
                  : stringToColor(user?.name),
              }}
            >
              {!user?.profilePicture && stringToInitials(user?.name)}
            </Avatar>
            <Box>
              <Typography fontWeight="600">{user?.name}</Typography>
              <Typography fontSize="14px" color="gray">
                {user?.email}
              </Typography>
            </Box>
          </Stack>
          <Typography mb={1}>
            <strong>User ID:</strong> {user?.id ? user?.id : user?._id}
          </Typography>
        </Card>
        <UserStats />
      </Box>
    </Box>
  );
};
export default Profile;