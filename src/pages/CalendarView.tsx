import { Box, Typography } from "@mui/material";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarView = () => {
  const today = new Date();
  const monthName = today.toLocaleString("default", { month: "long" });
  const year = today.getFullYear();

  return (
    <Box className="flex-1 p-6 flex flex-col bg-gray-50 h-full">
      <Typography variant="h5" className="font-bold mb-2 text-gray-800">
        Calendar
      </Typography>
      <Typography variant="subtitle1" className="mb-6 text-gray-600">
        {monthName} {year}
      </Typography>

      <Box className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map((d) => (
          <Typography
            key={d}
            variant="caption"
            className="text-center font-semibold text-gray-500"
          >
            {d}
          </Typography>
        ))}
      </Box>

      <Box className="grid grid-cols-7 gap-2 flex-1">
        {Array.from({ length: 35 }).map((_, index) => {
          const day = index + 1;
          const isToday = day === today.getDate();

          return (
            <Box
              key={index}
              className={`flex items-center justify-center h-12 rounded-md border text-sm ${
                isToday
                  ? "bg-indigo-100 border-indigo-400 text-indigo-700 font-semibold"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              {day <= 31 ? day : ""}
            </Box>
          );
        })}
      </Box>

      <Typography
        variant="caption"
        className="mt-4 text-gray-500 text-center"
      >
        This is a simulated calendar view for demo purposes.
      </Typography>
    </Box>
  );
};

export default CalendarView;
