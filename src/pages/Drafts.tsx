import { Box, Typography } from "@mui/material";

const Drafts = () => {
  return (
    <Box className="flex-1 p-6 flex flex-col items-center justify-center bg-gray-50 h-full">
      <Typography variant="h5" className="font-bold mb-2 text-gray-800">
        Drafts
      </Typography>
      <Typography variant="body2" className="text-gray-600 text-center max-w-md">
        You don't have any drafts yet. Start composing a new email and it will appear here if you save it as a draft.
      </Typography>
    </Box>
  );
};

export default Drafts;
