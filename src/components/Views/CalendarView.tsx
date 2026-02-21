import { M3Box, M3Typography } from "m3r";

const CalendarView = () => {
	return (
		<M3Box className="empty-view">
			<M3Typography variant="headlineMedium">Calendar</M3Typography>
			<M3Typography variant="bodyMedium" className="empty-view-subtitle">
				Calendar view is coming soon.
			</M3Typography>
		</M3Box>
	);
};

export default CalendarView;
