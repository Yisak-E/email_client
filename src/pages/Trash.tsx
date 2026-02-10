import { Box, Typography } from "@mui/material";

const Trash = () => {
  return (
    <Box className="flex-1 p-6 flex flex-col items-center justify-center bg-gray-50 h-full">
      <Typography variant="h5" className="font-bold mb-2 text-gray-800">
        Trash
      </Typography>
      <Typography variant="body2" className="text-gray-600 text-center max-w-md">
        Deleted emails will appear here. This is a simulated Trash folder for the demo.
      </Typography>
    </Box>
  );
};

export default Trash;
