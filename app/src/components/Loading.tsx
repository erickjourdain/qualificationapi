import { Box, Typography } from "@mui/material";

const Loading = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
      <Typography variant="h5">Chargement en cours....</Typography>
    </Box>
  )
}

export default Loading;