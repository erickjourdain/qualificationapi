import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const Loading = () => {
  return (
    <Box>
      <Skeleton variant="rounded" />
      <Skeleton variant="rounded" />
      <Skeleton variant="rounded" />
      <Skeleton variant="rounded" />
      <Skeleton variant="rounded" />
      <Skeleton variant="rounded" />
    </Box>
  )
}

export default Loading;