import React from "react";
import { Box } from "@mui/material";
import LoadingGIF from "@/app/assets/loading.gif";
const Loading = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& img": {
          width: "100px",
          height: "auto",
        },
      }}
    >
      <img src={LoadingGIF.src} alt="Loading...." />
    </Box>
  );
};

export default Loading;
