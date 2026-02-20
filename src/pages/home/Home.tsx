import { M3Box } from "m3r";
import Sidebar from "../../components/layout/Sidebar";
import { useEmailContext } from "../../EmailContext";
import EmailView from "../inbox/EmailView";
import Settings from "../settings/Settings";
import CalendarView from "../calender/CalendarView";
import ContactsView from "../contacts/ContactsView";
import NotesView from "../notes/NotesView";
import NavBar from "../../components/layout/NavBar";
import NavRail from "../../components/layout/NavRail";


export default function Home() {
  const { selectedPage } = useEmailContext();

  return (
    <M3Box className="app-shell">
      <NavRail />
      <M3Box className="main-panel">
        <NavBar />
        <M3Box className="content-container">
          <Sidebar />
          <M3Box className="content-view-container">
            {selectedPage === "inbox" && <EmailView />}
            {selectedPage === "settings" && <Settings />}
            {selectedPage === "calendar" && <CalendarView />}
            {selectedPage === "contacts" && <ContactsView />}
            {selectedPage === "notes" && <NotesView />}
          </M3Box>
        </M3Box>
      </M3Box>
    </M3Box>
  );
}